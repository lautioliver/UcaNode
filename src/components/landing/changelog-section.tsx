import { Megaphone } from "lucide-react";
import {
  CHANGELOG_META,
  CHANGELOG_RELEASES,
  type ChangelogItem,
  type ChangelogRelease,
} from "@/content/changelog";
import {
  CHANGELOG_KIND_META,
  type ChangelogKind,
} from "@/lib/changelog-labels";

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-surface-subtle px-1 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function ChangelogKindBadge({ kind }: { kind: ChangelogKind }) {
  const meta = CHANGELOG_KIND_META[kind];
  const Icon = meta.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-card px-2 py-0.5 text-[10px] font-medium text-secondary"
      title={meta.label}
    >
      <span aria-hidden>{meta.emoji}</span>
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">{meta.label}</span>
    </span>
  );
}

function ChangelogEntry({ item }: { item: ChangelogItem }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-secondary">
      <ChangelogKindBadge kind={item.kind} />
      <span className="min-w-0 pt-0.5">{renderInlineMarkdown(item.text)}</span>
    </li>
  );
}

function ReleaseCard({ release }: { release: ChangelogRelease }) {
  const grouped = release.items.reduce<Record<ChangelogKind, ChangelogItem[]>>(
    (acc, item) => {
      acc[item.kind] = acc[item.kind] ?? [];
      acc[item.kind].push(item);
      return acc;
    },
    {} as Record<ChangelogKind, ChangelogItem[]>,
  );

  const kinds = (
    Object.keys(grouped) as ChangelogKind[]
  ).filter((k) => grouped[k]?.length);

  return (
    <article className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] sm:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-base font-semibold tracking-tight text-primary">
              v{release.version}
            </h3>
            <span className="text-xs text-muted">{release.date}</span>
          </div>
          {release.summary ? (
            <p className="text-sm text-secondary">{release.summary}</p>
          ) : null}
        </div>
      </header>

      <div className="mt-4 space-y-5">
        {kinds.map((kind) => {
          const meta = CHANGELOG_KIND_META[kind];
          const Icon = meta.icon;
          const items = grouped[kind];

          return (
            <div key={kind}>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                <span aria-hidden>{meta.emoji}</span>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {meta.label}
              </p>
              <ul className="space-y-2.5">
                {items.map((item, idx) => (
                  <ChangelogEntry key={`${kind}-${idx}`} item={item} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function ChangelogSection() {
  return (
    <section id="novedades" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary shadow-[var(--shadow-card)]">
            <Megaphone className="h-3.5 w-3.5 text-accent" />
            Changelog
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {CHANGELOG_META.title}
          </h2>
          <p className="text-secondary">{CHANGELOG_META.subtitle}</p>
        </div>

        <div className="mt-10 space-y-4">
          {CHANGELOG_RELEASES.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Versión actual{" "}
          <span className="font-mono text-secondary">
            v{CHANGELOG_META.currentVersion}
          </span>
          {" · "}
          Historial completo en{" "}
          <a
            href="https://github.com/lautioliver/UcaNode/commits/develop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent transition hover:text-accent-hover"
          >
            GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
