"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CommunityComposer } from "@/app/comunidad/components/community-composer";
import { PostVoteButtons } from "@/app/comunidad/components/post-vote-buttons";
import {
  authorInitials,
  formatRelativeTime,
  type CommunityComment,
} from "@/app/comunidad/components/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createComment } from "@/lib/community/actions";

function countComments(items: CommunityComment[]): number {
  return items.reduce(
    (sum, item) => sum + 1 + (item.children ? countComments(item.children) : 0),
    0,
  );
}

function CommentNode({
  comment,
  postId,
  depth = 0,
  onReply,
}: {
  comment: CommunityComment;
  postId: string;
  depth?: number;
  onReply: (parentId: string) => void;
}) {
  return (
    <div className={depth > 0 ? "ml-2 border-l border-border pl-4" : ""}>
      <article className="space-y-2 py-3">
        <div className="flex items-start gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-surface-hover text-[10px] font-semibold text-secondary">
              {authorInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-medium text-primary">
                {comment.author.name}
              </span>
              <span className="text-[11px] text-muted">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-secondary">{comment.body}</p>
            <div className="flex flex-wrap items-center gap-2">
              <PostVoteButtons
                commentId={comment.id}
                initialUp={comment.votes.up}
                initialDown={comment.votes.down}
                compact
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted hover:text-accent"
                onClick={() => onReply(comment.id)}
              >
                Responder
              </Button>
            </div>
          </div>
        </div>
      </article>

      {comment.children?.map((child) => (
        <CommentNode
          key={child.id}
          comment={child}
          postId={postId}
          depth={depth + 1}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

type CommentThreadProps = {
  comments: CommunityComment[];
  postId: string;
};

export function CommentThread({ comments, postId }: CommentThreadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reply, setReply] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!reply.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await createComment({
        postId,
        content: reply.trim(),
        parentId: replyToId,
      });

      if (!result.success) {
        setError(result.message ?? "No se pudo publicar el comentario.");
        return;
      }

      setReply("");
      setReplyToId(null);
      router.refresh();
    });
  }

  function handleReply(parentId: string) {
    setReplyToId(parentId);
    document.getElementById(`reply-${postId}`)?.focus();
  }

  const totalComments = countComments(comments);

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h2 className="text-sm font-semibold text-primary">
          Comentarios ({totalComments})
        </h2>
        {comments.length === 0 ? (
          <p className="text-sm text-muted">Sé el primero en comentar.</p>
        ) : (
          comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
            />
          ))
        )}
      </section>

      <CommunityComposer
        value={reply}
        onChange={setReply}
        placeholder={
          replyToId ? "Escribe una respuesta al comentario" : "Escribe una respuesta"
        }
        submitLabel={isPending ? "Enviando…" : "Responder"}
        onSubmit={handleSubmit}
        rows={3}
        id={`reply-${postId}`}
      />

      {replyToId && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-muted"
          onClick={() => setReplyToId(null)}
        >
          Cancelar respuesta anidada
        </Button>
      )}

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
