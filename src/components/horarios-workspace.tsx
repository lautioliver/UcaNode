"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Pencil, Plus, Trash2, Video, X } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { HorarioCreateForm, HorarioEditForm } from "@/components/forms";
import { EmptyState, FilterPill } from "@/components/layout";
import {
  createHorario,
  deleteHorario,
  updateHorario,
} from "@/lib/actions";
import { diaSemanaLabel, modalidadLabel } from "@/lib/labels";

export type HorarioData = {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  modalidad: string;
  aulaLink: string | null;
  materiaId: string;
  materia: {
    id: string;
    nombre: string;
  };
};

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"] as const;

function wrapDelete(
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>,
) {
  return async (formData: FormData) => {
    await action({ success: true }, formData);
  };
}

function HorarioLine({
  horario,
  compact = false,
}: {
  horario: HorarioData;
  compact?: boolean;
}) {
  const presencial = horario.modalidad === "PRESENCIAL";

  return (
    <div
      className={`rounded-lg border border-border bg-surface ${
        compact ? "px-2.5 py-2" : "px-3 py-2.5"
      }`}
    >
      <p className="text-sm font-medium leading-snug text-primary">
        {horario.materia.nombre}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex items-center gap-1 text-xs text-secondary">
          <Clock className="h-3 w-3 shrink-0" />
          {horario.horaInicio}–{horario.horaFin}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            presencial ? "bg-success-ghost text-success" : "bg-accent-ghost text-accent"
          }`}
        >
          {presencial ? (
            <MapPin className="h-2.5 w-2.5 shrink-0" />
          ) : (
            <Video className="h-2.5 w-2.5 shrink-0" />
          )}
          {modalidadLabel[horario.modalidad as keyof typeof modalidadLabel]}
        </span>
        {horario.aulaLink && (
          <span className="text-[11px] leading-snug text-muted break-all">
            {horario.aulaLink}
          </span>
        )}
      </div>
    </div>
  );
}

function HorarioModal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface-card p-6 shadow-[var(--shadow-card-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              {subtitle}
            </p>
            <h3 className="text-base font-semibold text-primary">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function HorariosWorkspace({
  horarios: initialHorarios,
  materias,
  hoy,
}: {
  horarios: HorarioData[];
  materias: { id: string; nombre: string }[];
  hoy: string | null;
}) {
  const [editMode, setEditMode] = useState(false);
  const [addDay, setAddDay] = useState<string | null>(null);
  const [editing, setEditing] = useState<HorarioData | null>(null);

  const byDay = useMemo(
    () =>
      DIAS.map((dia) => ({
        dia,
        items: initialHorarios
          .filter((h) => h.dia === dia)
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
      })),
    [initialHorarios],
  );

  const closeModals = () => {
    setAddDay(null);
    setEditing(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          active={editMode}
          onClick={() => {
            setEditMode((v) => !v);
            closeModals();
          }}
          type="button"
        >
          {editMode ? "Salir de edición" : "Modo edición"}
        </FilterPill>
        {editMode && (
          <span className="text-xs text-muted">
            Podés agregar, editar o quitar clases de cada día.
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {byDay.map(({ dia, items }) => {
          const esHoy = dia === hoy;
          return (
            <section
              key={dia}
              className={`flex flex-col rounded-2xl border bg-surface-card p-5 shadow-[var(--shadow-card)] ${
                esHoy ? "border-accent" : "border-border"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {diaSemanaLabel[dia as keyof typeof diaSemanaLabel]}
                  </p>
                  {esHoy && (
                    <p className="text-[10px] font-medium uppercase tracking-wider text-accent">
                      Hoy
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-muted">
                  {items.length} clase{items.length === 1 ? "" : "s"}
                </span>
              </div>

              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((h) =>
                    editMode ? (
                      <div key={h.id} className="flex items-start gap-1.5">
                        <div className="min-w-0 flex-1">
                          <HorarioLine horario={h} compact />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditing(h)}
                          title="Editar"
                          aria-label={`Editar ${h.materia.nombre}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-secondary transition hover:bg-accent-ghost hover:text-accent"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <form
                          action={wrapDelete(deleteHorario)}
                          onSubmit={(e) => {
                            if (!confirm(`¿Quitar ${h.materia.nombre} del ${diaSemanaLabel[dia as keyof typeof diaSemanaLabel]}?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={h.id} />
                          <button
                            type="submit"
                            title="Quitar"
                            aria-label={`Quitar ${h.materia.nombre}`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-secondary transition hover:bg-danger-ghost hover:text-danger"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      <HorarioLine key={h.id} horario={h} />
                    ),
                  )}
                </div>
              ) : (
                <EmptyState message="Sin clases." />
              )}

              {editMode && (
                <button
                  type="button"
                  onClick={() => setAddDay(dia)}
                  className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-secondary transition hover:border-accent hover:text-accent"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar clase
                </button>
              )}
            </section>
          );
        })}
      </div>

      <HorarioModal
        open={addDay != null}
        onClose={() => setAddDay(null)}
        subtitle="Nueva clase"
        title={
          addDay
            ? diaSemanaLabel[addDay as keyof typeof diaSemanaLabel]
            : ""
        }
      >
        {addDay && (
          <HorarioCreateForm
            action={createHorario}
            materias={materias}
            dia={addDay}
            onSuccess={() => setAddDay(null)}
          />
        )}
      </HorarioModal>

      <HorarioModal
        open={editing != null}
        onClose={() => setEditing(null)}
        subtitle="Editar clase"
        title={editing?.materia.nombre ?? ""}
      >
        {editing && (
          <HorarioEditForm
            action={updateHorario}
            materias={materias}
            defaultValues={{
              id: editing.id,
              dia: editing.dia,
              horaInicio: editing.horaInicio,
              horaFin: editing.horaFin,
              modalidad: editing.modalidad,
              aulaLink: editing.aulaLink,
              materiaId: editing.materiaId,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </HorarioModal>
    </>
  );
}
