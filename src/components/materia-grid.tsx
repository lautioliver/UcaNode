"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { MateriaCreateForm, MateriaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { estadoMateriaColor, estadoMateriaLabel } from "@/lib/labels";

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
      <div className="grid gap-4 sm:grid-cols-3">
        {dias.map((dia) => (
          <section
            key={dia}
            className="flex min-h-[200px] flex-col rounded-xl border border-border bg-surface-card p-4"
          >
            <h3 className="mb-3 text-sm font-semibold text-primary">
              {diaLabel[dia]}
            </h3>
            <div className="flex-1 space-y-2">
              {porDia[dia].length === 0 ? (
                <p className="text-xs text-muted">Sin materias</p>
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
                        className="block rounded-lg border border-border bg-surface p-3 transition hover:border-border-accent hover:bg-surface-hover"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-primary truncate">
                              {m.nombre}
                            </p>
                            {m.codigo && (
                              <p className="mt-0.5 text-xs text-muted">
                                {m.codigo}
                              </p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${estadoMateriaColor[m.estado as keyof typeof estadoMateriaColor]}`}
                          >
                            {estadoMateriaLabel[m.estado as keyof typeof estadoMateriaLabel]}
                          </span>
                        </div>
                        {(m.profesor || m.semestre) && (
                          <p className="mt-2 text-xs text-muted">
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
              className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2 text-sm text-secondary transition hover:border-accent hover:text-accent"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </section>
        ))}
      </div>

      {modalDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModalDay(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-surface-card p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-primary">
                Nueva materia · {diaLabel[modalDay]}
              </h3>
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
