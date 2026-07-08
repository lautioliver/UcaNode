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

  const sinDia = materias.filter((m) => !m.dia || !dias.includes(m.dia as (typeof dias)[number]));

  const renderMateriaCard = (m: Materia) => (
    <ItemActions
      key={m.id}
      label={m.nombre}
      modalTitle={m.nombre}
      deleteAction={deleteMateria}
      deleteId={m.id}
      view={
        <a
          href={`/materias/${m.id}`}
          className="block rounded-xl border border-border bg-surface p-3 pb-10 transition hover:border-border-strong"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-snug text-primary">
              {m.nombre}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {m.codigo && (
                <span className="rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary">
                  {m.codigo}
                </span>
              )}
              <StatusBadge
                tone={
                  estadoMateriaTone[m.estado as EstadoMateria] ?? "neutral"
                }
              >
                {estadoMateriaLabel[m.estado as EstadoMateria]}
              </StatusBadge>
            </div>
            {(m.profesor || m.semestre) && (
              <p className="text-[11px] text-muted">
                {[m.semestre, m.profesor].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
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
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {dias.map((dia) => (
          <section
            key={dia}
            className="flex min-h-[240px] flex-col rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-primary">
                {diaLabel[dia]}
              </h3>
              <span className="shrink-0 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-muted">
                {porDia[dia].length}
              </span>
            </div>

            <div className="flex-1 space-y-2.5">
              {porDia[dia].length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
                  Sin materias
                </p>
              ) : (
                porDia[dia].map(renderMateriaCard)
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

      {sinDia.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-primary">
                Sin día asignado
              </h3>
              <p className="text-[11px] text-muted">
                Materias finalizadas o que aún no cargaste en un día de la semana.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-muted">
              {sinDia.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sinDia.map(renderMateriaCard)}
          </div>
        </section>
      )}

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
