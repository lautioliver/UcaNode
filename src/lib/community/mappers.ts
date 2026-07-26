import {
  slugifyMateria,
  type CommunityAttachment,
  type CommunityAuthor,
  type CommunityComment,
  type CommunityMateria,
  type CommunityPost,
  type TopResource,
} from "@/app/comunidad/components/mock-data";
import { aggregateVotes } from "@/lib/community/votes";
import type {
  CommentWithRelations,
  PlanEstudioRef,
  PostWithRelations,
} from "@/lib/community/types";
import { toUiAttachmentType } from "@/lib/community/types";

const EXCERPT_LENGTH = 160;

export function academicYear(anioIngreso: number, now = new Date()): number {
  const currentYear = now.getFullYear();
  const month = now.getMonth();
  const academicStartYear = month >= 2 ? currentYear : currentYear - 1;
  return Math.max(1, academicStartYear - anioIngreso + 1);
}

export function toCommunityAuthor(
  perfil: { id: string; nombre: string; anioIngreso: number },
  karmaByPerfilId: Map<string, number>,
): CommunityAuthor {
  return {
    name: perfil.nombre,
    year: academicYear(perfil.anioIngreso),
    karma: karmaByPerfilId.get(perfil.id) ?? 0,
  };
}

export function toCommunityMateria(planEstudio: PlanEstudioRef): CommunityMateria {
  if (!planEstudio) {
    return { slug: "general", label: "General" };
  }
  return {
    slug: slugifyMateria(planEstudio.nombre),
    label: planEstudio.nombre,
  };
}

function toCommunityAttachments(
  attachments: { name: string; url: string; type: string }[],
): CommunityAttachment[] {
  return attachments.map((att) => ({
    name: att.name,
    url: att.url,
    type: toUiAttachmentType(att.type as Parameters<typeof toUiAttachmentType>[0]),
  }));
}

export function makeExcerpt(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= EXCERPT_LENGTH) return trimmed;
  return `${trimmed.slice(0, EXCERPT_LENGTH)}…`;
}

export function toCommunityPost(
  row: PostWithRelations,
  karmaByPerfilId: Map<string, number>,
  options?: {
    comments?: CommunityComment[];
    includeComments?: boolean;
  },
): CommunityPost {
  const votes = aggregateVotes(row.votes);
  return {
    id: row.id,
    title: row.title,
    excerpt: makeExcerpt(row.content),
    body: row.content,
    author: toCommunityAuthor(row.perfil, karmaByPerfilId),
    materia: toCommunityMateria(row.planEstudio),
    carrera: row.carrera?.nombre ?? "UCASAL",
    createdAt: row.createdAt.toISOString(),
    votes,
    commentCount: row._count.comments,
    attachments:
      row.attachments.length > 0
        ? toCommunityAttachments(row.attachments)
        : undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
    comments: options?.includeComments ? (options.comments ?? []) : [],
  };
}

export function toCommunityComment(
  row: CommentWithRelations,
  karmaByPerfilId: Map<string, number>,
  children?: CommunityComment[],
): CommunityComment {
  return {
    id: row.id,
    author: toCommunityAuthor(row.perfil, karmaByPerfilId),
    body: row.content,
    createdAt: row.createdAt.toISOString(),
    votes: aggregateVotes(row.votes),
    children,
  };
}

export function toTopResource(
  row: PostWithRelations,
): TopResource {
  const votes = aggregateVotes(row.votes);
  return {
    postId: row.id,
    title: row.title.length > 40 ? `${row.title.slice(0, 40)}…` : row.title,
    materia: toCommunityMateria(row.planEstudio).label,
    votes: votes.up - votes.down,
  };
}
