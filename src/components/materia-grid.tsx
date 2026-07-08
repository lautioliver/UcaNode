"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { MateriaCreateForm, MateriaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { StatusBadge } from "@/components/layout";
import { estadoMateriaLabel, estadoMateriaTone } from "@/lib/labels";
import type { EstadoMateria } from "@/generated/prisma/client";

const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"] as const;
const diaLabel: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
};

type Materia = {
  id: string;
  nombre: string;
  codigo: string | null;
  estado: string;
  profesor: string | null;
  cuatrimestre: number | null;
  anio: number | null;
  semestre: string | null;
  correlativas: string | null;
  notas: string | null;
  promocional: boolean;
  dia: string | null;
};

export function MateriaGrid({
  materias,
  createMateria,
  updateMateria,
  deleteMateria,
}: {
  materias: Materia[];
  createMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  updateMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  deleteMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [modalDay, setModalDay] = useState<string | null>(null);

  const porDia = dias.reduce(
    (acc, d) => {
      acc[d] = materias.filter((m) => m.dia === d);
      return acc;
    },
    {} as Record<string, Materia[]>,
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {dias.map((dia) => (
          <section
            key={dia}
            className="flex min-h-[220px] flex-col rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">
                {diaLabel[dia]}
              </h3>
              <span className="text-[10px] text-muted">
                {porDia[dia].length} materia{porDia[dia].length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              {porDia[dia].length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
                  Sin materias
                </p>
              ) : (
                porDia[dia].map((m) => (
                  <ItemActions
                    key={m.id}
                    label={m.nombre}
                    deleteAction={deleteMateria}
                    deleteId={m.id}
                    view={
                      <a
                        href={`/materias/${m.id}`}
                        className="block rounded-xl border border-border bg-surface p-3 transition hover:border-border-strong"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-primary">
                              {m.nombre}
                            </p>
                            {m.codigo && (
                              <p className="mt-0.5 text-[11px] text-muted">
                                {m.codigo}
                              </p>
                            )}
                          </div>
                          <StatusBadge
                            tone={
                              estadoMateriaTone[m.estado as EstadoMateria] ??
                              "neutral"
                            }
                          >
                            {estadoMateriaLabel[m.estado as EstadoMateria]}
                          </StatusBadge>
                        </div>
                        {(m.profesor || m.semestre) && (
                          <p className="mt-2 text-[11px] text-muted">
                            {[m.semestre, m.profesor]
                              .filter(Boolean)
                              .join(" · ")}
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
                          dia: m.dia,
                        }}
                      />
                    }
                  />
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setModalDay(dia)}
              className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-secondary transition hover:border-accent hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </section>
        ))}
      </div>

      {modalDay && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setModalDay(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-surface-card p-6 shadow-[var(--shadow-card-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  Nueva materia
                </p>
                <h3 className="text-base font-semibold text-primary">
                  {diaLabel[modalDay]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDay(null)}
                className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <MateriaCreateForm action={createMateria} dia={modalDay} />
          </div>
        </div>
      )}
    </>
  );
}
