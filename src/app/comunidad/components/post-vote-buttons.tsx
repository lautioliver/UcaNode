"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { voteComment, votePost } from "@/lib/community/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoteValue = "up" | "down" | null;

type PostVoteButtonsProps = {
  initialUp: number;
  initialDown: number;
  initialUserVote?: 1 | -1 | null;
  postId?: string;
  commentId?: string;
  compact?: boolean;
  onVoteChange?: (vote: VoteValue) => void;
};

function userVoteToUi(vote: 1 | -1 | null | undefined): VoteValue {
  if (vote === 1) return "up";
  if (vote === -1) return "down";
  return null;
}

export function PostVoteButtons({
  initialUp,
  initialDown,
  initialUserVote = null,
  postId,
  commentId,
  compact = false,
  onVoteChange,
}: PostVoteButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [vote, setVote] = useState<VoteValue>(userVoteToUi(initialUserVote));
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);

  function applyLocalVote(next: "up" | "down") {
    if (vote === next) {
      if (next === "up") setUp((v) => v - 1);
      else setDown((v) => v - 1);
      setVote(null);
      onVoteChange?.(null);
      return null;
    }

    if (vote === "up") setUp((v) => v - 1);
    if (vote === "down") setDown((v) => v - 1);

    if (next === "up") setUp((v) => v + 1);
    else setDown((v) => v + 1);

    setVote(next);
    onVoteChange?.(next);
    return next;
  }

  function handleVote(next: "up" | "down") {
    const type = next === "up" ? 1 : -1;
    const previousVote = vote;
    const previousUp = up;
    const previousDown = down;
    applyLocalVote(next);

    if (!postId && !commentId) return;

    startTransition(async () => {
      const result = postId
        ? await votePost(postId, type as 1 | -1)
        : await voteComment(commentId!, type as 1 | -1);

      if (!result.success) {
        setVote(previousVote);
        setUp(previousUp);
        setDown(previousDown);
        onVoteChange?.(previousVote);
        return;
      }

      if (result.up !== undefined && result.down !== undefined) {
        setUp(result.up);
        setDown(result.down);
        setVote(userVoteToUi(result.userVote ?? null));
      }
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface",
        compact ? "text-xs" : "text-sm",
        isPending && "opacity-70",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon-xs" : "icon-sm"}
        onClick={() => handleVote("up")}
        disabled={isPending}
        className={cn(
          "rounded-l-full rounded-r-none hover:bg-accent-ghost hover:text-accent",
          vote === "up" && "bg-accent-ghost text-accent",
        )}
        aria-label="Votar positivo"
      >
        <ChevronUp className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </Button>
      <span className="min-w-[2ch] px-1 text-center font-semibold text-primary tabular-nums">
        {up - down}
      </span>
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon-xs" : "icon-sm"}
        onClick={() => handleVote("down")}
        disabled={isPending}
        className={cn(
          "rounded-l-none rounded-r-full hover:bg-danger/10 hover:text-danger",
          vote === "down" && "bg-danger/10 text-danger",
        )}
        aria-label="Votar negativo"
      >
        <ChevronDown className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </Button>
    </div>
  );
}
