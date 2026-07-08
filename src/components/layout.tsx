import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

export function PageHeader({
  pill,
  title,
  description,
  action,
}: {
  pill?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        {pill && (
          <span className="inline-flex items-center rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary">
            {pill}
          </span>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

const dotClass: Record<Tone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted",
};

export function CounterChip({
  count,
  label,
  tone = "neutral",
}: {
  count: number;
  label: string;
  tone?: Tone;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1.5 text-xs text-secondary">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
      <span className="font-semibold text-primary">{count}</span>
      <span>{label}</span>
    </span>
  );
}

export function FilterPill({
  active,
  children,
  href,
  onClick,
  type,
}: {
  active?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const className = `inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-accent text-white shadow-[var(--shadow-card)]"
      : "border border-border bg-surface-card text-secondary hover:border-border-strong hover:text-primary"
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

const badgeToneClass: Record<Tone, string> = {
  accent:
    "border-[color:var(--accent)]/30 bg-accent-ghost text-accent",
  success:
    "border-[color:var(--success)]/30 bg-success-ghost text-success",
  warning:
    "border-[color:var(--warning)]/30 bg-warning-ghost text-warning",
  danger:
    "border-[color:var(--danger)]/30 bg-danger-ghost text-danger",
  neutral:
    "border-border bg-surface text-secondary",
};

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${badgeToneClass[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
      {children}
    </span>
  );
}

const progressToneClass: Record<Tone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted",
};

const textToneClass: Record<Tone, string> = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-primary",
};

export function ProgressBar({
  value,
  tone = "accent",
  showValue = true,
  label,
}: {
  value: number;
  tone?: Tone;
  showValue?: boolean;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const rounded = Math.round(clamped);
  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-secondary">{label}</span>}
          {showValue && (
            <span className={`font-semibold ${textToneClass[tone]}`}>
              {rounded}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className={`h-full rounded-full ${progressToneClass[tone]} transition-all`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  action,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        {action}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      {message}
    </p>
  );
}

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary transition hover:border-border-strong hover:text-primary"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" />
    </Link>
  );
}

export function CalendarSectionTitle() {
  return (
    <h2 className="text-sm font-semibold text-primary">Vista calendario</h2>
  );
}
