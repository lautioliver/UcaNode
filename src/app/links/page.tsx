import type { Metadata } from "next";
import { Star, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/layout";
import { LinkCreateForm, LinkEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createLink, updateLink, deleteLink } from "@/lib/actions";
import { categoriaLinkLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Links — UcaNode",
};

export default async function LinksPage() {
  const [links, perfil] = await Promise.all([
    prisma.linkExterno.findMany({
      orderBy: [{ favorito: "desc" }, { nombre: "asc" }],
    }),
    prisma.perfil.findFirst(),
  ]);

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-card px-5 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Links externos</h1>
          <p className="text-sm text-muted">
            Accesos directos a Drive, campus, GitHub y más.
          </p>
        </div>
        {perfil?.nombre && (
          <span className="text-sm text-secondary">{perfil.nombre}</span>
        )}
      </header>

      <SectionCard title="Nuevo link">
        <LinkCreateForm action={createLink} />
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
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
                className="group block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-primary">{link.nombre}</p>
                    <p className="mt-1 text-xs text-muted">
                      {categoriaLinkLabel[link.categoria]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {link.favorito && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
        ))}
      </div>
    </main>
  );
}
