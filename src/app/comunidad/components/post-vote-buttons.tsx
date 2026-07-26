"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoteValue = "up" | "down" | null;

type PostVoteButtonsProps = {
  initialUp: number;
  initialDown: number;
  compact?: boolean;
  onVoteChange?: (vote: VoteValue) => void;
};

export function PostVoteButtons({
  initialUp,
  initialDown,
  compact = false,
  onVoteChange,
}: PostVoteButtonsProps) {
  const [vote, setVote] = useState<VoteValue>(null);
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);

  function handleVote(next: "up" | "down") {
    if (vote === next) {
      if (next === "up") setUp((v) => v - 1);
      else setDown((v) => v - 1);
      setVote(null);
      onVoteChange?.(null);
      return;
    }

    if (vote === "up") setUp((v) => v - 1);
    if (vote === "down") setDown((v) => v - 1);

    if (next === "up") setUp((v) => v + 1);
    else setDown((v) => v + 1);

    setVote(next);
    onVoteChange?.(next);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface",
        compact ? "text-xs" : "text-sm",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon-xs" : "icon-sm"}
        onClick={() => handleVote("up")}
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
