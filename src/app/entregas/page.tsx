import type { Metadata } from "next";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CalendarioMes } from "@/components/calendario";
import {
  CounterChip,
  EmptyState,
  FilterPill,
  PageHeader,
  SectionCard,
} from "@/components/layout";
import { EntregaCard } from "@/components/entrega-card";
import { EntregaCreateForm, EntregaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createEntrega, updateEntrega, deleteEntrega } from "@/lib/actions";
import { tipoEntregaLabel } from "@/lib/labels";
import { daysUntil } from "@/lib/entrega-utils";
import { TipoEntrega } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Entregas — UcaNode",
};

const FILTROS = [
  { value: "", label: "Todos" },
  { value: "TP", label: "TPs" },
  { value: "PARCIAL", label: "Parciales" },
  { value: "FINAL", label: "Finales" },
] as const;

export default async function EntregasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}) {
  const { q, tipo } = await searchParams;

  const [allEntregas, materias] = await Promise.all([
    prisma.entrega.findMany({
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const pendientes = allEntregas.filter((e) => e.estado !== "ENTREGADO");
  const urgentes = pendientes.filter((e) => daysUntil(e.fecha) < 2);
  const enSemana = pendientes.filter((e) => {
    const d = daysUntil(e.fecha);
    return d >= 2 && d <= 7;
  });
  const aTiempo = pendientes.filter((e) => daysUntil(e.fecha) > 7);

  const entregas = allEntregas.filter((e) => {
    if (tipo && e.tipo !== tipo) return false;
    if (q) {
      const s = q.toLowerCase();
      return (
        e.titulo.toLowerCase().includes(s) ||
        e.materia.nombre.toLowerCase().includes(s) ||
        e.tipo.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));

  const buildFiltroHref = (t: string) => {
    const params = new URLSearchParams();
    if (t) params.set("tipo", t);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/entregas?${qs}` : "/entregas";
  };

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Todas tus entregas"
        title="¿Qué tenés que entregar?"
        description="Filtra por tipo o buscá por nombre. Cada tarjeta muestra el estado y cuánto tiempo te queda."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="danger" count={urgentes.length} label="Urgentes" />
        <CounterChip tone="warning" count={enSemana.length} label="Esta semana" />
        <CounterChip tone="success" count={aTiempo.length} label="A tiempo" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <FilterPill
            key={f.value}
            href={buildFiltroHref(f.value)}
            active={(tipo ?? "") === f.value}
          >
            {f.label}
          </FilterPill>
        ))}
      </div>

      <SectionCard title="Nueva entrega">
        <EntregaCreateForm action={createEntrega} materias={materiasList} />
      </SectionCard>

      <SectionCard title="Vista calendario">
        <CalendarioMes entregas={allEntregas} />
      </SectionCard>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-primary">
            {tipo
              ? `${tipoEntregaLabel[tipo as TipoEntrega] ?? "Filtro"}s`
              : "Todas las entregas"}
          </h2>
          <form className="relative w-full max-w-xs">
            {tipo && <input type="hidden" name="tipo" value={tipo} />}
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="Buscar entrega..."
              className="w-full rounded-full border border-border bg-surface-card py-2 pl-9 pr-3 text-sm text-primary placeholder:text-muted focus:border-border-accent focus:outline-none"
            />
          </form>
        </div>

        {entregas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {entregas.map((e) => (
              <ItemActions
                key={e.id}
                label={e.titulo}
                deleteAction={deleteEntrega}
                deleteId={e.id}
                view={<EntregaCard entrega={e} />}
                editForm={
                  <EntregaEditForm
                    action={updateEntrega}
                    materias={materiasList}
                    defaultValues={{
                      id: e.id,
                      titulo: e.titulo,
                      tipo: e.tipo,
                      fecha: e.fecha.toISOString().slice(0, 10),
                      estado: e.estado,
                      nota: e.nota,
                      materiaId: e.materiaId,
                      recurso: e.recurso,
                      prioridad: e.prioridad,
                    }}
                  />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              q
                ? `Sin resultados para "${q}".`
                : "No hay entregas cargadas todavía."
            }
          />
        )}
      </section>
    </main>
  );
}
