import { ExternalLink, Star } from "lucide-react";
import { createLink } from "@/lib/actions";
import { AppHeader, SectionCard } from "@/components/layout";
import { categoriaLinkLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { CategoriaLink } from "@/generated/prisma/client";

export default async function LinksPage() {
  const [links, perfil] = await Promise.all([
    prisma.linkExterno.findMany({
      orderBy: [{ favorito: "desc" }, { nombre: "asc" }],
    }),
    prisma.perfil.findFirst(),
  ]);

  return (
    <main className="space-y-6">
      <AppHeader perfilNombre={perfil?.nombre} />

      <div>
        <h1 className="text-2xl font-semibold">Links externos</h1>
        <p className="text-sm text-zinc-500">
          Accesos directos a Drive, campus, GitHub y más (botón 2 del dashboard).
        </p>
      </div>

      <SectionCard title="Nuevo link">
        <form action={createLink} className="grid gap-3 sm:grid-cols-2">
          <input
            name="nombre"
            required
            placeholder="Nombre"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="url"
            type="url"
            required
            placeholder="https://..."
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            name="categoria"
            defaultValue={CategoriaLink.OTRO}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(categoriaLinkLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input name="favorito" type="checkbox" className="rounded" />
            Marcar como favorito
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 sm:col-span-2"
          >
            Agregar link
          </button>
        </form>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-emerald-500/30 hover:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-zinc-100">{link.nombre}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {categoriaLinkLabel[link.categoria]}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {link.favorito && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
                <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
