import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  FileText,
} from "lucide-react";
import { CommentThread } from "@/app/comunidad/components/comment-thread";
import {
  authorInitials,
  formatRelativeTime,
} from "@/app/comunidad/components/mock-data";
import { PostVoteButtons } from "@/app/comunidad/components/post-vote-buttons";
import { StatusBadge } from "@/components/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPostById, getUserPostVote } from "@/lib/community/queries";
import { getPerfil } from "@/lib/perfil";

type Props = {
  params: Promise<{ postId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const perfil = await getPerfil();
  const post = perfil
    ? await getPostById(postId, perfil.id)
    : null;
  return {
    title: post ? `${post.title} — Comunidad` : "Comunidad — UcaNode",
  };
}

export default async function ComunidadPostPage({ params }: Props) {
  const { postId } = await params;
  const perfil = await getPerfil();
  if (!perfil) return null;

  const [post, userVote] = await Promise.all([
    getPostById(postId, perfil.id),
    getUserPostVote(perfil.id, postId),
  ]);
  if (!post) notFound();

  return (
    <main className="min-w-0 space-y-6">
      <Link
        href="/comunidad"
        className="inline-flex text-sm text-secondary transition hover:text-accent"
      >
        ← Volver al feed
      </Link>

      <article className="space-y-5 rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">#{post.materia.label}</StatusBadge>
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="bg-accent-ghost text-xs font-semibold text-accent">
              {authorInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-medium text-primary">{post.author.name}</span>
              <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                {post.author.year}.º año
              </span>
              <span className="text-xs text-muted">{post.author.karma} karma</span>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
            <p className="text-xs text-muted">{post.carrera}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            {post.title}
          </h1>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-secondary">
            {post.body}
          </div>
          {post.attachments && post.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.attachments.map((att) => (
                <a
                  key={att.name}
                  href={att.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-secondary transition hover:border-border-strong"
                >
                  {att.type === "drive" ? (
                    <ExternalLink className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <span className="truncate">{att.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <PostVoteButtons
            postId={post.id}
            initialUp={post.votes.up}
            initialDown={post.votes.down}
            initialUserVote={userVote}
          />
        </div>
      </article>

      <CommentThread comments={post.comments} postId={post.id} />
    </main>
  );
}
