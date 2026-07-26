import { EstadoMateria } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildCommentTree } from "@/lib/community/comment-tree";
import {
  toCommunityPost,
  toTopResource,
} from "@/lib/community/mappers";
import type { GetPostsInput } from "@/lib/community/schemas";
import type {
  PostDetailWithRelations,
  PostWithRelations,
} from "@/lib/community/types";
import type { CommunityPost, TopResource } from "@/app/comunidad/components/mock-data";
import type { Prisma } from "@/generated/prisma/client";

const POST_INCLUDE = {
  perfil: { select: { id: true, nombre: true, anioIngreso: true } },
  planEstudio: { select: { id: true, codigo: true, nombre: true } },
  carrera: { select: { id: true, nombre: true } },
  attachments: true,
  votes: { select: { type: true, perfilId: true } },
  _count: { select: { comments: true } },
} as const;

const POST_DETAIL_INCLUDE = {
  ...POST_INCLUDE,
  comments: {
    include: {
      perfil: { select: { id: true, nombre: true, anioIngreso: true } },
      votes: { select: { type: true, perfilId: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

const PAGE_SIZE = 20;

export async function getKarmaByPerfilIds(
  perfilIds: string[],
): Promise<Map<string, number>> {
  const karma = new Map<string, number>();
  if (perfilIds.length === 0) return karma;

  const uniqueIds = [...new Set(perfilIds)];

  const [postVotes, commentVotes] = await Promise.all([
    prisma.postVote.groupBy({
      by: ["type"],
      where: { post: { perfilId: { in: uniqueIds } } },
      _count: true,
    }),
    prisma.commentVote.groupBy({
      by: ["type"],
      where: { comment: { perfilId: { in: uniqueIds } } },
      _count: true,
    }),
  ]);

  // Per-perfil karma requires per-author aggregation
  const [postVotesByAuthor, commentVotesByAuthor] = await Promise.all([
    prisma.postVote.findMany({
      where: { post: { perfilId: { in: uniqueIds } } },
      select: { type: true, post: { select: { perfilId: true } } },
    }),
    prisma.commentVote.findMany({
      where: { comment: { perfilId: { in: uniqueIds } } },
      select: { type: true, comment: { select: { perfilId: true } } },
    }),
  ]);

  for (const id of uniqueIds) karma.set(id, 0);

  for (const vote of postVotesByAuthor) {
    const authorId = vote.post.perfilId;
    karma.set(authorId, (karma.get(authorId) ?? 0) + vote.type);
  }
  for (const vote of commentVotesByAuthor) {
    const authorId = vote.comment.perfilId;
    karma.set(authorId, (karma.get(authorId) ?? 0) + vote.type);
  }

  void postVotes;
  void commentVotes;

  return karma;
}

function collectPerfilIdsFromPosts(rows: PostWithRelations[]): string[] {
  return rows.flatMap((row) => [row.perfil.id]);
}

function collectPerfilIdsFromPostDetail(row: PostDetailWithRelations): string[] {
  return [
    row.perfil.id,
    ...row.comments.map((c) => c.perfil.id),
  ];
}

async function buildPostsDto(
  rows: PostWithRelations[],
): Promise<CommunityPost[]> {
  const perfilIds = collectPerfilIdsFromPosts(rows);
  const karmaByPerfilId = await getKarmaByPerfilIds(perfilIds);
  return rows.map((row) => toCommunityPost(row, karmaByPerfilId));
}

export async function getPosts(
  input: GetPostsInput & { perfilId: string },
): Promise<CommunityPost[]> {
  const { tab, searchQuery, cursor, perfilId } = input;

  const perfil = await prisma.perfil.findUnique({
    where: { id: perfilId },
    select: { carreraId: true },
  });

  const where: Prisma.PostWhereInput = {};

  if (tab === "carrera" && perfil?.carreraId) {
    where.carreraId = perfil.carreraId;
  }

  if (tab === "materias") {
    const cursando = await prisma.materia.findMany({
      where: { perfilId, estado: EstadoMateria.CURSANDO },
      select: { codigo: true, nombre: true, planEstudioId: true },
    });
    const codigos = cursando
      .map((m) => m.codigo)
      .filter((c): c is string => Boolean(c));
    const planIds = cursando
      .map((m) => m.planEstudioId)
      .filter((id): id is string => Boolean(id));

    where.OR = [
      ...(codigos.length > 0
        ? [{ planEstudio: { codigo: { in: codigos } } }]
        : []),
      ...(planIds.length > 0 ? [{ planEstudioId: { in: planIds } }] : []),
    ];
    if (!where.OR?.length) {
      return [];
    }
  }

  if (tab === "archivos") {
    where.attachments = { some: {} };
  }

  if (searchQuery?.trim()) {
    const q = searchQuery.trim();
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { planEstudio: { nombre: { contains: q, mode: "insensitive" } } },
          { tags: { has: q } },
        ],
      },
    ];
  }

  if (cursor) {
    const cursorPost = await prisma.post.findUnique({
      where: { id: cursor },
      select: { createdAt: true },
    });
    if (cursorPost) {
      where.createdAt = { lt: cursorPost.createdAt };
    }
  }

  const rows = await prisma.post.findMany({
    where,
    include: POST_INCLUDE,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE,
  });

  return buildPostsDto(rows);
}

export async function getPostById(
  postId: string,
  _perfilId: string,
): Promise<CommunityPost | null> {
  const row = await prisma.post.findUnique({
    where: { id: postId },
    include: POST_DETAIL_INCLUDE,
  });

  if (!row) return null;

  const karmaByPerfilId = await getKarmaByPerfilIds(
    collectPerfilIdsFromPostDetail(row),
  );
  const commentTree = buildCommentTree(row.comments, karmaByPerfilId);

  return toCommunityPost(row, karmaByPerfilId, {
    comments: commentTree,
    includeComments: true,
  });
}

export type CommunitySidebarData = {
  topResources: TopResource[];
  trendingTags: string[];
};

export async function getCommunitySidebarData(): Promise<CommunitySidebarData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [postsWithAttachments, recentPosts] = await Promise.all([
    prisma.post.findMany({
      where: { attachments: { some: {} } },
      include: POST_INCLUDE,
      take: 50,
    }),
    prisma.post.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { tags: true },
    }),
  ]);

  const topResources = postsWithAttachments
    .map((row) => {
      const votes = row.votes.reduce(
        (acc, v) => {
          if (v.type === 1) acc.up += 1;
          else if (v.type === -1) acc.down += 1;
          return acc;
        },
        { up: 0, down: 0 },
      );
      return { row, score: votes.up - votes.down };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ row }) => toTopResource(row));

  const tagCounts = new Map<string, number>();
  for (const post of recentPosts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const trendingTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    topResources,
    trendingTags:
      trendingTags.length > 0
        ? trendingTags
        : ["Finales", "Moodle", "Inscrip"],
  };
}

export async function getUserPostVote(
  perfilId: string,
  postId: string,
): Promise<1 | -1 | null> {
  const vote = await prisma.postVote.findUnique({
    where: { perfilId_postId: { perfilId, postId } },
    select: { type: true },
  });
  if (!vote) return null;
  return vote.type === 1 ? 1 : -1;
}

export async function getUserCommentVote(
  perfilId: string,
  commentId: string,
): Promise<1 | -1 | null> {
  const vote = await prisma.commentVote.findUnique({
    where: { perfilId_commentId: { perfilId, commentId } },
    select: { type: true },
  });
  if (!vote) return null;
  return vote.type === 1 ? 1 : -1;
}
