"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Database,
  FileText,
  Globe,
  Laptop,
  Network,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { MateriaCreateForm, MateriaEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { EmptyState, FilterPill } from "@/components/layout";
import { findMateriaByName } from "@/lib/correlatividades";

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

type PeriodoTipo = "anual" | "primer" | "segundo" | "otro";

const PERIODO_ORDEN: Record<PeriodoTipo, number> = {
  anual: 0,
  primer: 1,
  segundo: 2,
  otro: 3,
};

const PERIODO_FILTROS: { value: PeriodoTipo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los períodos" },
  { value: "anual", label: "Anual" },
  { value: "primer", label: "1° Semestre" },
  { value: "segundo", label: "2° Semestre" },
];

const SKIP_WORDS = new Set(["de", "del", "la", "las", "los", "y", "a", "en", "al"]);
const ROMAN = new Set(["i", "ii", "iii", "iv", "v", "vi"]);

function initialsFromNombre(nombre: string): string {
  const words = nombre.trim().split(/\s+/);
  let abbr = "";

  for (const word of words) {
    const lower = word.toLowerCase();
    if (SKIP_WORDS.has(lower)) continue;
    if (ROMAN.has(lower)) {
      abbr += word.toUpperCase();
      continue;
    }
    abbr += word[0]?.toUpperCase() ?? "";
  }

  return abbr || nombre.slice(0, 3).toUpperCase();
}

function materiaAbbr(nombre: string, codigo: string | null): string {
  const plan = findMateriaByName(nombre);
  if (plan) return plan.abreviatura;
  if (codigo) {
    const compact = codigo.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (compact.length <= 6) return compact;
  }
  return initialsFromNombre(nombre);
}

function periodoTipo(m: Materia): PeriodoTipo {
  const sem = m.semestre?.toLowerCase() ?? "";
  if (sem.includes("anual")) return "anual";
  if (sem.includes("2") || sem.includes("segundo")) return "segundo";
  if (sem.includes("1") || sem.includes("primero")) return "primer";
  if (m.cuatrimestre === 2) return "segundo";
  if (m.cuatrimestre === 1) return "primer";

  const plan = findMateriaByName(m.nombre);
  if (plan) {
    if (plan.semestre === 0 || plan.tipoDictado === "Anual") return "anual";
    if (plan.semestre === 1) return "primer";
    if (plan.semestre === 2) return "segundo";
  }

  return "otro";
}

function periodoLabel(m: Materia, tipo: PeriodoTipo): string {
  if (m.semestre) return m.semestre;
  if (tipo === "anual") return "Anual";
  if (tipo === "primer") return "1° Semestre";
  if (tipo === "segundo") return "2° Semestre";
  if (m.cuatrimestre != null) return `${m.cuatrimestre}° cuatrimestre`;
  return "Sin período";
}

function periodBadges(m: Materia): {
  year: { label: string; className: string } | null;
  period: { label: string; className: string };
} {
  const tipo = periodoTipo(m);
  const period = periodoLabel(m, tipo);

  let periodClassName = "bg-surface-hover text-muted";
  if (tipo === "anual") periodClassName = "bg-violet-500/15 text-violet-400";
  else if (tipo === "segundo") periodClassName = "bg-amber-600/20 text-amber-400";
  else if (tipo === "primer") periodClassName = "bg-sky-500/15 text-sky-400";

  return {
    year:
      m.anio != null
        ? { label: `${m.anio}° año`, className: "bg-surface-hover text-secondary" }
        : null,
    period: { label: period, className: periodClassName },
  };
}

function sortMaterias(list: Materia[]): Materia[] {
  return [...list].sort((a, b) => {
    const ta = periodoTipo(a);
    const tb = periodoTipo(b);
    if (PERIODO_ORDEN[ta] !== PERIODO_ORDEN[tb]) {
      return PERIODO_ORDEN[ta] - PERIODO_ORDEN[tb];
    }
    const anioA = a.anio ?? 99;
    const anioB = b.anio ?? 99;
    if (anioA !== anioB) return anioA - anioB;
    return a.nombre.localeCompare(b.nombre, "es");
  });
}

function materiaIcon(nombre: string): LucideIcon {
  const n = nombre.toLowerCase();
  if (n.includes("redes")) return Globe;
  if (n.includes("sistemas operativos")) return Laptop;
  if (n.includes("sistemas")) return Network;
  if (n.includes("base de datos") || n.includes("datos")) return Database;
  return FileText;
}

function CreateMateriaModal({
  open,
  onClose,
  createMateria,
}: {
  open: boolean;
  onClose: () => void;
  createMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
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
              Nueva materia
            </p>
            <h3 className="text-base font-semibold text-primary">
              Agregar al catálogo
            </h3>
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
        <MateriaCreateForm action={createMateria} onSuccess={onClose} />
      </div>
    </div>
  );
}

export function MateriaCatalog({
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
  const [createOpen, setCreateOpen] = useState(false);
  const [filtroAnio, setFiltroAnio] = useState<string>("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<PeriodoTipo | "todos">("todos");

  const aniosDisponibles = useMemo(() => {
    const set = new Set<number>();
    for (const m of materias) {
      if (m.anio != null) set.add(m.anio);
    }
    return [...set].sort((a, b) => a - b);
  }, [materias]);

  const materiasVisibles = useMemo(() => {
    const filtered = materias.filter((m) => {
      if (filtroAnio !== "todos" && m.anio !== Number(filtroAnio)) return false;
      if (filtroPeriodo !== "todos" && periodoTipo(m) !== filtroPeriodo) return false;
      return true;
    });
    return sortMaterias(filtered);
  }, [materias, filtroAnio, filtroPeriodo]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          active={filtroAnio === "todos"}
          onClick={() => setFiltroAnio("todos")}
          type="button"
        >
          Todos los años
        </FilterPill>
        {aniosDisponibles.map((anio) => (
          <FilterPill
            key={anio}
            active={filtroAnio === String(anio)}
            onClick={() => setFiltroAnio(String(anio))}
            type="button"
          >
            {anio}° año
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PERIODO_FILTROS.map(({ value, label }) => (
          <FilterPill
            key={value}
            active={filtroPeriodo === value}
            onClick={() => setFiltroPeriodo(value)}
            type="button"
          >
            {label}
          </FilterPill>
        ))}
      </div>

      {materiasVisibles.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            message={
              filtroAnio !== "todos" || filtroPeriodo !== "todos"
                ? "No hay materias para ese año o período."
                : "Todavía no cargaste materias."
            }
          />
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex min-h-[108px] w-full max-w-sm flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-secondary"
          >
            <Plus className="h-4 w-4" />
            Nueva materia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materiasVisibles.map((m) => {
            const abbr = materiaAbbr(m.nombre, m.codigo);
            const badges = periodBadges(m);
            const Icon = materiaIcon(m.nombre);

            return (
              <ItemActions
                key={m.id}
                label={m.nombre}
                modalTitle={m.nombre}
                deleteAction={deleteMateria}
                deleteId={m.id}
                view={
                  <a
                    href={`/materias/${m.id}`}
                    className="flex min-h-[108px] flex-col rounded-lg border border-border bg-surface-card p-3 pb-9 transition hover:border-border-strong hover:bg-surface-hover"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                      <p className="min-w-0 text-sm leading-snug text-primary">
                        <span className="font-medium">{abbr}</span>
                        <span className="text-muted"> | </span>
                        <span>{m.nombre}</span>
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {badges.year && (
                        <span
                          className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${badges.year.className}`}
                        >
                          {badges.year.label}
                        </span>
                      )}
                      <span
                        className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${badges.period.className}`}
                      >
                        {badges.period.label}
                      </span>
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
          })}

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex min-h-[108px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-secondary"
          >
            <Plus className="h-4 w-4" />
            Nueva materia
          </button>
        </div>
      )}

      <CreateMateriaModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        createMateria={createMateria}
      />
    </>
  );
}
