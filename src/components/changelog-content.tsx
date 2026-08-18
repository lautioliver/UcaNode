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
    <li className="flex items-center gap-2 text-sm text-secondary">
      <ChangelogKindBadge kind={item.kind} />
      <span className="text-primary">{item.title}</span>
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
    <article className="space-y-4">
      <header className="space-y-2 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-mono text-base font-semibold tracking-tight text-primary">
            v{release.version}
          </h2>
          <span className="text-xs text-muted">{release.date}</span>
        </div>
        <p className="text-sm leading-relaxed text-secondary">{release.summary}</p>
      </header>

      <div className="space-y-4">
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
              <ul className="space-y-2">
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

export function ChangelogContent() {
  return (
    <div className="space-y-8">
      {CHANGELOG_RELEASES.map((release) => (
        <ReleaseCard key={release.version} release={release} />
      ))}

      <p className="border-t border-border pt-6 text-center text-xs text-muted">
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
  );
}
