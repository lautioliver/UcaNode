"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function getShortcutLabel() {
  if (typeof navigator === "undefined") return "Ctrl K";
  return /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent) ? "⌘ K" : "Ctrl K";
}

function subscribe() {
  return () => {};
}

export function SearchShortcutKbd({ className }: { className?: string }) {
  const label = useSyncExternalStore(subscribe, getShortcutLabel, () => "Ctrl K");

  return (
    <kbd
      className={cn(
        "rounded-md border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted",
        className
      )}
    >
      {label}
    </kbd>
  );
}
