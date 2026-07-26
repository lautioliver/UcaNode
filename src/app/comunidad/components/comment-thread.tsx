"use client";

import { useState } from "react";
import { CommunityComposer } from "@/app/comunidad/components/community-composer";
import { PostVoteButtons } from "@/app/comunidad/components/post-vote-buttons";
import {
  authorInitials,
  formatRelativeTime,
  type CommunityComment,
} from "@/app/comunidad/components/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function CommentNode({
  comment,
  depth = 0,
}: {
  comment: CommunityComment;
  depth?: number;
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
            <PostVoteButtons
              initialUp={comment.votes.up}
              initialDown={comment.votes.down}
              compact
            />
          </div>
        </div>
      </article>

      {comment.children?.map((child) => (
        <CommentNode key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );
}

type CommentThreadProps = {
  comments: CommunityComment[];
  postId: string;
};

export function CommentThread({ comments, postId }: CommentThreadProps) {
  const [reply, setReply] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  function handleSubmit() {
    if (!reply.trim()) return;

    setLocalComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: { name: "Vos", year: 3, karma: 0 },
        body: reply.trim(),
        createdAt: new Date().toISOString(),
        votes: { up: 1, down: 0 },
      },
    ]);
    setReply("");
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h2 className="text-sm font-semibold text-primary">
          Comentarios ({localComments.length})
        </h2>
        {localComments.length === 0 ? (
          <p className="text-sm text-muted">Sé el primero en comentar.</p>
        ) : (
          localComments.map((comment) => (
            <CommentNode key={comment.id} comment={comment} />
          ))
        )}
      </section>

      <CommunityComposer
        value={reply}
        onChange={setReply}
        placeholder="Escribe una respuesta"
        submitLabel="Responder"
        onSubmit={handleSubmit}
        rows={3}
        id={`reply-${postId}`}
      />
    </div>
  );
}
