"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import {
  TOP_RESOURCES,
  TRENDING_TAGS,
} from "@/app/comunidad/components/mock-data";
import { FilterPill } from "@/components/layout";

function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 text-sm font-semibold text-primary">{title}</h3>
      {children}
    </section>
  );
}

type CommunitySidebarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
};

export function CommunitySidebar({
  searchQuery,
  onSearchChange,
  activeTag,
  onTagSelect,
}: CommunitySidebarProps) {
  return (
    <aside className="flex w-full min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar discusiones..."
          className="w-full rounded-full border border-border bg-surface-card py-2 pl-9 pr-3 text-sm text-primary placeholder:text-muted focus:border-border-accent focus:outline-none"
        />
      </div>

      <SidebarPanel title="Top recursos">
        <ul className="space-y-2">
          {TOP_RESOURCES.map((resource, i) => (
            <li key={resource.postId}>
              <Link
                href={`/comunidad/${resource.postId}`}
                className="block rounded-xl border border-border bg-surface px-3 py-2.5 transition hover:border-border-strong"
              >
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-ghost text-[10px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">
                      {resource.title}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {resource.materia} · ↑ {resource.votes}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Tendencias">
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TAGS.map((tag) => (
            <FilterPill
              key={tag}
              active={activeTag === tag}
              onClick={() => onTagSelect(activeTag === tag ? null : tag)}
            >
              #{tag}
            </FilterPill>
          ))}
        </div>
      </SidebarPanel>

      <SidebarPanel title="Reglas de la comunidad">
        <ul className="space-y-1.5 text-xs leading-snug text-secondary">
          <li>Respetá a compañeros y docentes. No compartas datos personales.</li>
          <li>Subí material con fuente clara y verificá que no infrinja derechos de autor.</li>
          <li>Usá la etiqueta de materia correcta para facilitar la búsqueda.</li>
          <li>Reportá contenido inapropiado desde el hilo o contactando moderación.</li>
        </ul>
      </SidebarPanel>
    </aside>
  );
}
