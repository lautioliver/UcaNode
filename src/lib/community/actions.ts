"use server";

import { revalidatePath, refresh } from "next/cache";
import { headers } from "next/headers";
import type { AttachmentType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrCreatePerfil } from "@/lib/perfil";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createCommentSchema,
  createPostSchema,
  voteSchema,
} from "@/lib/community/schemas";
import { aggregateVotes } from "@/lib/community/votes";
import type { ActionResult } from "@/lib/actions";

function ok<T extends Record<string, unknown> | undefined = undefined>(
  message?: string,
  data?: T,
): ActionResult & T {
  return { success: true, message, ...data } as ActionResult & T;
}

function fail(
  message: string,
  errors?: Record<string, string[]>,
): ActionResult {
  return { success: false, message, errors };
}

async function checkLimit(): Promise<ActionResult | null> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return fail("Demasiadas solicitudes. Esperá un momento e intentá de nuevo.");
  }
  return null;
}

async function requireWritablePerfil() {
  const perfil = await getOrCreatePerfil();
  if (perfil.fantasma) {
    throw new Error("FANTASMA");
  }
  return perfil;
}

function revalidateCommunity(postId?: string) {
  revalidatePath("/comunidad");
  if (postId) revalidatePath(`/comunidad/${postId}`);
  refresh();
}

export type VoteActionResult = ActionResult & {
  up?: number;
  down?: number;
  userVote?: 1 | -1 | null;
};

export async function createPost(input: {
  title: string;
  content: string;
  planEstudioCodigo?: string | null;
  tags?: string[];
  attachments?: { name: string; url: string; type: AttachmentType }[];
}): Promise<ActionResult & { postId?: string }> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await requireWritablePerfil();

    let planEstudioId: string | null = null;
    const codigo = parsed.data.planEstudioCodigo?.trim();
    if (codigo && codigo !== "general") {
      if (!perfil.carreraId) {
        return fail("Seleccioná una carrera para publicar en una materia.");
      }
      const plan = await prisma.planEstudio.findFirst({
        where: { codigo, carreraId: perfil.carreraId },
      });
      if (!plan) {
        return fail("La materia seleccionada no pertenece a tu carrera.");
      }
      planEstudioId = plan.id;
    }

    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        tags: parsed.data.tags ?? [],
        perfilId: perfil.id,
        carreraId: perfil.carreraId,
        planEstudioId,
        attachments: parsed.data.attachments?.length
          ? {
              create: parsed.data.attachments.map((att) => ({
                name: att.name,
                url: att.url,
                type: att.type,
              })),
            }
          : undefined,
      },
    });

    revalidateCommunity();
    return ok("Publicación creada", { postId: post.id });
  } catch (e) {
    if (e instanceof Error && e.message === "FANTASMA") {
      return fail("Completá tu registro para publicar en la comunidad.");
    }
    console.error("createPost", e);
    return fail("No se pudo crear la publicación.");
  }
}

export async function createComment(input: {
  postId: string;
  content: string;
  parentId?: string | null;
}): Promise<ActionResult & { commentId?: string }> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await requireWritablePerfil();

    const post = await prisma.post.findUnique({
      where: { id: parsed.data.postId },
      select: { id: true },
    });
    if (!post) return fail("La publicación no existe.");

    if (parsed.data.parentId) {
      const parent = await prisma.comment.findFirst({
        where: { id: parsed.data.parentId, postId: parsed.data.postId },
      });
      if (!parent) return fail("El comentario padre no existe.");
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        postId: parsed.data.postId,
        perfilId: perfil.id,
        parentId: parsed.data.parentId ?? null,
      },
    });

    revalidateCommunity(parsed.data.postId);
    return ok("Comentario publicado", { commentId: comment.id });
  } catch (e) {
    if (e instanceof Error && e.message === "FANTASMA") {
      return fail("Completá tu registro para comentar.");
    }
    console.error("createComment", e);
    return fail("No se pudo publicar el comentario.");
  }
}

export async function votePost(
  postId: string,
  type: 1 | -1,
): Promise<VoteActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = voteSchema.safeParse({ targetId: postId, type });
  if (!parsed.success) return fail("Voto inválido");

  try {
    const perfil = await requireWritablePerfil();

    const existing = await prisma.postVote.findUnique({
      where: { perfilId_postId: { perfilId: perfil.id, postId } },
    });

    if (existing?.type === type) {
      await prisma.postVote.delete({
        where: { perfilId_postId: { perfilId: perfil.id, postId } },
      });
    } else if (existing) {
      await prisma.postVote.update({
        where: { perfilId_postId: { perfilId: perfil.id, postId } },
        data: { type },
      });
    } else {
      await prisma.postVote.create({
        data: { perfilId: perfil.id, postId, type },
      });
    }

    const votes = await prisma.postVote.findMany({
      where: { postId },
      select: { type: true },
    });
    const counts = aggregateVotes(votes);
    const userVote = await prisma.postVote.findUnique({
      where: { perfilId_postId: { perfilId: perfil.id, postId } },
      select: { type: true },
    });

    revalidateCommunity(postId);
    const resolvedVote: 1 | -1 | null = userVote
      ? userVote.type === 1
        ? 1
        : -1
      : null;
    return ok(undefined, {
      up: counts.up,
      down: counts.down,
      userVote: resolvedVote,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "FANTASMA") {
      return fail("Completá tu registro para votar.");
    }
    console.error("votePost", e);
    return fail("No se pudo registrar el voto.");
  }
}

export async function voteComment(
  commentId: string,
  type: 1 | -1,
): Promise<VoteActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = voteSchema.safeParse({ targetId: commentId, type });
  if (!parsed.success) return fail("Voto inválido");

  try {
    const perfil = await requireWritablePerfil();

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });
    if (!comment) return fail("El comentario no existe.");

    const existing = await prisma.commentVote.findUnique({
      where: { perfilId_commentId: { perfilId: perfil.id, commentId } },
    });

    if (existing?.type === type) {
      await prisma.commentVote.delete({
        where: { perfilId_commentId: { perfilId: perfil.id, commentId } },
      });
    } else if (existing) {
      await prisma.commentVote.update({
        where: { perfilId_commentId: { perfilId: perfil.id, commentId } },
        data: { type },
      });
    } else {
      await prisma.commentVote.create({
        data: { perfilId: perfil.id, commentId, type },
      });
    }

    const votes = await prisma.commentVote.findMany({
      where: { commentId },
      select: { type: true },
    });
    const counts = aggregateVotes(votes);
    const userVote = await prisma.commentVote.findUnique({
      where: { perfilId_commentId: { perfilId: perfil.id, commentId } },
      select: { type: true },
    });

    revalidateCommunity(comment.postId);
    const resolvedVote: 1 | -1 | null = userVote
      ? userVote.type === 1
        ? 1
        : -1
      : null;
    return ok(undefined, {
      up: counts.up,
      down: counts.down,
      userVote: resolvedVote,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "FANTASMA") {
      return fail("Completá tu registro para votar.");
    }
    console.error("voteComment", e);
    return fail("No se pudo registrar el voto.");
  }
}
