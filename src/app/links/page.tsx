import type { Metadata } from "next";
import {
  Code2,
  ExternalLink,
  HardDrive,
  Link2,
  School,
  Star,
} from "lucide-react";
import type { ComponentType } from "react";
import { prisma } from "@/lib/prisma";
import {
  CounterChip,
  EmptyState,
  FilterPill,
  PageHeader,
  SectionCard,
} from "@/components/layout";
import { LinkCreateForm, LinkEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createLink, updateLink, deleteLink } from "@/lib/actions";
import { categoriaLinkLabel } from "@/lib/labels";
import { CategoriaLink } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Links — UcaNode",
};

const categoriaIcon: Record<CategoriaLink, ComponentType<{ className?: string }>> = {
  GOOGLE_DRIVE: HardDrive,
  PLATAFORMA_UCASAL: School,
  GITHUB: Code2,
  OTRO: Link2,
};

const FILTROS: { value: CategoriaLink | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PLATAFORMA_UCASAL", label: "Ucasal" },
  { value: "GOOGLE_DRIVE", label: "Drive" },
  { value: "GITHUB", label: "GitHub" },
  { value: "OTRO", label: "Otros" },
];

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const allLinks = await prisma.linkExterno.findMany({
    orderBy: [{ favorito: "desc" }, { nombre: "asc" }],
  });

  const links = cat
    ? allLinks.filter((l) => l.categoria === cat)
    : allLinks;

  const favoritos = allLinks.filter((l) => l.favorito).length;

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Todos tus atajos"
        title="¿Necesitás abrir algo del campus?"
        description="Guardá enlaces al Campus, Drive, GitHub o cualquier recurso importante. Marcá tus favoritos para verlos primero."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="accent" count={allLinks.length} label="Total" />
        <CounterChip tone="warning" count={favoritos} label="Favoritos" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <FilterPill
            key={f.value}
            href={f.value ? `/links?cat=${f.value}` : "/links"}
            active={(cat ?? "") === f.value}
          >
            {f.label}
          </FilterPill>
        ))}
      </div>

      <SectionCard title="Nuevo link">
        <LinkCreateForm action={createLink} />
      </SectionCard>

      {links.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const Icon = categoriaIcon[link.categoria];
            return (
              <ItemActions
                key={link.id}
                label={link.nombre}
                deleteAction={deleteLink}
                deleteId={link.id}
                view={
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block rounded-2xl border bg-surface-card p-4 shadow-[var(--shadow-card)] transition hover:border-border-strong ${
                      link.favorito ? "border-[color:var(--warning)]/40" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-primary">
                            {link.nombre}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            {categoriaLinkLabel[link.categoria]}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {link.favorito && (
                          <Star className="h-4 w-4 fill-warning text-warning" />
                        )}
                        <ExternalLink className="h-4 w-4 text-muted group-hover:text-accent" />
                      </div>
                    </div>
                  </a>
                }
                editForm={
                  <LinkEditForm
                    action={updateLink}
                    defaultValues={{
                      id: link.id,
                      nombre: link.nombre,
                      url: link.url,
                      categoria: link.categoria,
                      favorito: link.favorito,
                    }}
                  />
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          message={
            cat
              ? "Sin links en esta categoría."
              : "Aún no cargaste ningún link."
          }
        />
      )}
    </main>
  );
}
