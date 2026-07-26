"use client";

import {
  Bookmark,
  ExternalLink,
  FileText,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostVoteButtons } from "@/app/comunidad/components/post-vote-buttons";
import {
  authorInitials,
  formatRelativeTime,
  type CommunityPost,
} from "@/app/comunidad/components/mock-data";
import { StatusBadge } from "@/components/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const attachmentIcon = {
  pdf: FileText,
  drive: ExternalLink,
  exam: FileText,
} as const;

type PostCardProps = {
  post: CommunityPost;
  interactive?: boolean;
};

export function PostCard({ post, interactive = true }: PostCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  function openPost() {
    if (interactive) router.push(`/comunidad/${post.id}`);
  }

  return (
    <article
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={openPost}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPost();
              }
            }
          : undefined
      }
      className={cn(
        "flex min-w-0 w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)] transition sm:p-5",
        interactive &&
          "cursor-pointer hover:border-border-strong hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <StatusBadge tone="accent">#{post.materia.label}</StatusBadge>
        {post.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex min-w-0 items-start gap-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-accent-ghost text-[10px] font-semibold text-accent">
            {authorInitials(post.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-medium text-primary">{post.author.name}</span>
            <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-secondary">
              {post.author.year}.º año
            </span>
            <span className="text-[11px] text-muted">{post.author.karma} karma</span>
            <span className="text-[11px] text-muted">·</span>
            <span className="text-[11px] text-muted">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <h2 className="text-base font-semibold leading-snug text-primary sm:text-lg">
          {post.title}
        </h2>
        <p className="line-clamp-2 text-sm text-secondary">{post.excerpt}</p>
        {post.attachments && post.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.attachments.map((att) => {
              const Icon = attachmentIcon[att.type];
              return (
                <span
                  key={att.name}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-secondary"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="truncate">{att.name}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <PostVoteButtons initialUp={post.votes.up} initialDown={post.votes.down} />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openPost}
            className="gap-1.5 text-secondary hover:text-primary"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs tabular-nums">{post.commentCount}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setSaved((s) => !s)}
            className={cn(saved && "text-accent")}
            aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Compartir"
            className="text-secondary hover:text-primary"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
