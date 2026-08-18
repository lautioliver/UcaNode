import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bug,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
type ChangelogTone = "accent" | "success" | "warning" | "danger" | "neutral";

export type ChangelogKind =
  | "feature"
  | "fix"
  | "improvement"
  | "docs"
  | "security";

export const CHANGELOG_KIND_META: Record<
  ChangelogKind,
  { label: string; emoji: string; icon: LucideIcon; tone: ChangelogTone }
> = {
  feature: {
    label: "Nuevo",
    emoji: "✨",
    icon: Sparkles,
    tone: "accent",
  },
  fix: {
    label: "Fix",
    emoji: "🐛",
    icon: Bug,
    tone: "danger",
  },
  improvement: {
    label: "Mejora",
    emoji: "💡",
    icon: TrendingUp,
    tone: "warning",
  },
  docs: {
    label: "Docs",
    emoji: "📚",
    icon: BookOpen,
    tone: "neutral",
  },
  security: {
    label: "Seguridad",
    emoji: "🔒",
    icon: ShieldCheck,
    tone: "success",
  },
};
