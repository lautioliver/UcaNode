import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/layout";
import { MateriaCreateForm, MateriaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createMateria, updateMateria, deleteMateria } from "@/lib/actions";
import { estadoMateriaColor, estadoMateriaLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Materias — UcaNode",
};

export default async function MateriasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allMaterias = await prisma.materia.findMany({ orderBy: { nombre: "asc" } });

  const materias = q
    ? allMaterias.filter(
        (m) =>
          m.nombre.toLowerCase().includes(q.toLowerCase()) ||
          (m.codigo?.toLowerCase() ?? "").includes(q.toLowerCase()) ||
          (m.profesor?.toLowerCase() ?? "").includes(q.toLowerCase()),
      )
    : allMaterias;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Materias</h1>
        <p className="text-sm text-muted">
          Tabla maestra de todas tus materias de la carrera.
        </p>
      </div>

      <SectionCard title="Nueva materia">
        <MateriaCreateForm action={createMateria} />
      </SectionCard>

      <SectionCard title={`Todas (${materias.length})`}>
        <form className="mb-3">
          <input
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder="Buscar materia..."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted"
          />
        </form>
        <div className="space-y-2">
          {materias.map((m) => (
            <ItemActions
              key={m.id}
              label={m.nombre}
              deleteAction={deleteMateria}
              deleteId={m.id}
              view={
                <a
                  href={`/materias/${m.id}`}
                  className="block rounded-lg border border-border bg-surface p-3 transition hover:border-border-accent hover:bg-surface-hover"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-primary">{m.nombre}</p>
                      {m.codigo && (
                        <p className="mt-0.5 text-xs text-muted">{m.codigo}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${estadoMateriaColor[m.estado]}`}
                    >
                      {estadoMateriaLabel[m.estado]}
                    </span>
                  </div>
                  {(m.profesor || m.semestre) && (
                    <p className="mt-2 text-xs text-muted">
                      {[m.semestre, m.profesor].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </a>
              }
              editForm={
                <MateriaEditForm
                  action={updateMateria}
                  defaultValues={{
                    id: m.id,
                    nombre: m.nombre,
                    codigo: m.codigo,
                    estado: m.estado,
                    profesor: m.profesor,
                    cuatrimestre: m.cuatrimestre,
                    anio: m.anio,
                    semestre: m.semestre,
                    correlativas: m.correlativas,
                    notas: m.notas,
                    promocional: m.promocional,
                  }}
                />
              }
            />
          ))}
          {materias.length === 0 && q && (
            <p className="text-sm text-muted">Sin resultados para &quot;{q}&quot;.</p>
          )}
        </div>
      </SectionCard>
    </main>
  );
}
