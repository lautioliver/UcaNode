import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CalendarioMes } from "@/components/calendario";
import { SectionCard } from "@/components/layout";
import { EntregaCreateForm, EntregaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createEntrega, updateEntrega, deleteEntrega } from "@/lib/actions";
import {
  estadoEntregaLabel,
  tipoEntregaColor,
  tipoEntregaLabel,
} from "@/lib/labels";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Entregas — UcaNode",
};

export default async function EntregasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [allEntregas, materias] = await Promise.all([
    prisma.entrega.findMany({
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const entregas = q
    ? allEntregas.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q.toLowerCase()) ||
          e.materia.nombre.toLowerCase().includes(q.toLowerCase()) ||
          e.tipo.toLowerCase().includes(q.toLowerCase()),
      )
    : allEntregas;

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Entregas</h1>
        <p className="text-sm text-muted">
          TP, parciales y finales de todas tus materias.
        </p>
      </div>

      <SectionCard title="Nueva entrega">
        <EntregaCreateForm action={createEntrega} materias={materiasList} />
      </SectionCard>

      <SectionCard title="Vista calendario">
        <CalendarioMes entregas={allEntregas} />
      </SectionCard>

      <SectionCard title="Lista completa">
        <form className="mb-3">
          <input
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder="Buscar entrega..."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted"
          />
        </form>
        <div className="space-y-2">
          {entregas.map((e) => (
            <ItemActions
              key={e.id}
              label={e.titulo}
              deleteAction={deleteEntrega}
              deleteId={e.id}
              view={
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">{e.titulo}</p>
                    <p className="truncate text-xs text-muted">{e.materia.nombre}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tipoEntregaColor[e.tipo]}`}
                    >
                      {tipoEntregaLabel[e.tipo]}
                    </span>
                    <span className="text-xs text-secondary">
                      {format(e.fecha, "d MMM yyyy", { locale: es })}
                    </span>
                    <span className="text-[10px] text-muted">
                      {estadoEntregaLabel[e.estado]}
                    </span>
                  </div>
                </div>
              }
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
                    materiaId: e.materiaId,
                    recurso: e.recurso,
                    prioridad: e.prioridad,
                  }}
                />
              }
            />
          ))}
          {entregas.length === 0 && q && (
            <p className="text-sm text-muted">Sin resultados para &quot;{q}&quot;.</p>
          )}
        </div>
      </SectionCard>
    </main>
  );
}
