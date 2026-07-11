"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Database,
  FileText,
  Globe,
  Laptop,
  Network,
  Plus,
  type LucideIcon,
} from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { Drawer } from "@/components/drawer";
import { MateriaCreateForm, MateriaEditForm } from "@/components/forms";
import { EmptyState, FilterPill } from "@/components/layout";
import { createCorrelatividadesHelpers, type MateriaPlan } from "@/lib/correlatividades";

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

type DrawerState =
  | { mode: "create" }
  | { mode: "edit"; materia: Materia }
  | null;

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

function materiaAbbr(
  nombre: string,
  codigo: string | null,
  findMateriaByName: (value: string) => MateriaPlan | null,
): string {
  const plan = findMateriaByName(nombre);
  if (plan) return plan.abreviatura;
  if (codigo) {
    const compact = codigo.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (compact.length <= 6) return compact;
  }
  return initialsFromNombre(nombre);
}

function periodoTipo(
  m: Materia,
  findMateriaByName: (value: string) => MateriaPlan | null,
): PeriodoTipo {
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

function periodBadges(
  m: Materia,
  findMateriaByName: (value: string) => MateriaPlan | null,
): {
  year: { label: string; className: string } | null;
  period: { label: string; className: string };
} {
  const tipo = periodoTipo(m, findMateriaByName);
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

function sortMaterias(
  list: Materia[],
  findMateriaByName: (value: string) => MateriaPlan | null,
): Materia[] {
  return [...list].sort((a, b) => {
    const ta = periodoTipo(a, findMateriaByName);
    const tb = periodoTipo(b, findMateriaByName);
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

export function MateriaCatalog({
  materias,
  createMateria,
  updateMateria,
  deleteMateria,
  planMaterias = [],
}: {
  materias: Materia[];
  createMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  updateMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  deleteMateria: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  planMaterias?: MateriaPlan[];
}) {
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [filtroAnio, setFiltroAnio] = useState<string>("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<PeriodoTipo | "todos">("todos");

  const planHelpers = useMemo(
    () => createCorrelatividadesHelpers(planMaterias),
    [planMaterias],
  );
  const findMateriaByName = planHelpers.findMateriaByName;

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
      if (filtroPeriodo !== "todos" && periodoTipo(m, findMateriaByName) !== filtroPeriodo) {
        return false;
      }
      return true;
    });
    return sortMaterias(filtered, findMateriaByName);
  }, [materias, filtroAnio, filtroPeriodo, findMateriaByName]);

  const openCreate = () => setDrawer({ mode: "create" });
  const openEdit = (materia: Materia) => setDrawer({ mode: "edit", materia });
  const closeDrawer = () => setDrawer(null);

  const handleDelete = async (materia: Materia) => {
    if (!confirm(`¿Eliminar "${materia.nombre}"?`)) return;
    const fd = new FormData();
    fd.set("id", materia.id);
    await deleteMateria({ success: true }, fd);
    closeDrawer();
  };

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
            onClick={openCreate}
            className="flex min-h-[108px] w-full max-w-sm flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-secondary"
          >
            <Plus className="h-4 w-4" />
            Nueva materia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materiasVisibles.map((m) => {
            const abbr = materiaAbbr(m.nombre, m.codigo, findMateriaByName);
            const badges = periodBadges(m, findMateriaByName);
            const Icon = materiaIcon(m.nombre);

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => openEdit(m)}
                className="flex min-h-[108px] flex-col rounded-lg border border-border bg-surface-card p-3 text-left transition hover:border-border-strong hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <p className="min-w-0 text-sm leading-snug text-primary">
                    <span className="font-medium">{abbr}</span>
                    <span className="text-slate-600 dark:text-slate-300"> | </span>
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
              </button>
            );
          })}

          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-[108px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-secondary"
          >
            <Plus className="h-4 w-4" />
            Nueva materia
          </button>
        </div>
      )}

      <Drawer
        open={drawer?.mode === "create"}
        onClose={closeDrawer}
        subtitle="Nueva materia"
        title="Agregar al catálogo"
      >
        <MateriaCreateForm
          action={createMateria}
          onSuccess={closeDrawer}
          planMaterias={planMaterias}
        />
      </Drawer>

      <Drawer
        open={drawer?.mode === "edit"}
        onClose={closeDrawer}
        subtitle="Editar materia"
        title={drawer?.mode === "edit" ? drawer.materia.nombre : ""}
      >
        {drawer?.mode === "edit" && (
          <>
            <Link
              href={`/materias/${drawer.materia.id}`}
              className="mb-4 inline-flex text-xs font-medium text-accent transition hover:text-accent-hover"
            >
              Ver detalle completo →
            </Link>
            <MateriaEditForm
              action={updateMateria}
              onSuccess={closeDrawer}
              onDelete={() => handleDelete(drawer.materia)}
              planMaterias={planMaterias}
              defaultValues={{
                id: drawer.materia.id,
                nombre: drawer.materia.nombre,
                codigo: drawer.materia.codigo,
                estado: drawer.materia.estado,
                profesor: drawer.materia.profesor,
                cuatrimestre: drawer.materia.cuatrimestre,
                anio: drawer.materia.anio,
                semestre: drawer.materia.semestre,
                correlativas: drawer.materia.correlativas,
                notas: drawer.materia.notas,
                promocional: drawer.materia.promocional,
                dia: drawer.materia.dia,
              }}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
