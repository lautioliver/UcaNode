import type { Metadata } from "next";
import { getOrCreatePerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";
import {
  CounterChip,
  FilterPill,
  PageHeader,
} from "@/components/layout";
import { LinksCatalog } from "@/components/links-catalog";
import { createLink, updateLink, deleteLink } from "@/lib/actions";
import { CategoriaLink } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Links — UcaNode",
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
  const perfil = await getOrCreatePerfil();
  const allLinks = await prisma.linkExterno.findMany({
    where: { perfilId: perfil.id },
    orderBy: [{ favorito: "desc" }, { nombre: "asc" }],
  });

  const links = cat
    ? allLinks.filter((l) => l.categoria === cat)
    : allLinks;

  const favoritos = allLinks.filter((l) => l.favorito).length;

  const json = links.map((l) => ({
    id: l.id,
    nombre: l.nombre,
    url: l.url,
    categoria: l.categoria,
    favorito: l.favorito,
  }));

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Todos tus atajos"
        title="¿Necesitás abrir algo del campus?"
        description="Galería de enlaces al Campus, Drive, GitHub y más. Tocá una tarjeta para abrir o editar."
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

      <LinksCatalog
        links={json}
        emptyMessage={
          cat
            ? "Sin links en esta categoría."
            : "Aún no cargaste ningún link."
        }
        createLink={createLink}
        updateLink={updateLink}
        deleteLink={deleteLink}
      />
    </main>
  );
}
