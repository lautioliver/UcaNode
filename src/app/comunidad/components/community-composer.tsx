"use client";

import { Bold, Code, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ComposerFormatBarProps = {
  onAttach?: () => void;
  attachActive?: boolean;
  className?: string;
};

export function ComposerFormatBar({
  onAttach,
  attachActive = false,
  className,
}: ComposerFormatBarProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Negrita">
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Código">
        <Code className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Adjuntar archivo"
        onClick={onAttach}
        className={cn(attachActive && "bg-accent-ghost text-accent")}
      >
        <Paperclip className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

type ComposerToolbarProps = {
  submitLabel: string;
  disabled?: boolean;
  onAttach?: () => void;
  attachActive?: boolean;
  className?: string;
};

export function ComposerToolbar({
  submitLabel,
  disabled = false,
  onAttach,
  attachActive = false,
  className,
}: ComposerToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ComposerFormatBar onAttach={onAttach} attachActive={attachActive} />
      <Button type="submit" disabled={disabled} className="ml-auto">
        {submitLabel}
      </Button>
    </div>
  );
}

type CommunityComposerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
  rows?: number;
  id?: string;
};

export function CommunityComposer({
  value,
  onChange,
  placeholder = "Escribe una respuesta",
  submitLabel,
  onSubmit,
  disabled = false,
  rows = 3,
  id,
}: CommunityComposerProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]"
    >
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="max-h-52 min-h-0 resize-none overflow-y-auto field-sizing-fixed"
      />
      <ComposerToolbar
        submitLabel={submitLabel}
        disabled={disabled || !value.trim()}
      />
    </form>
  );
}
