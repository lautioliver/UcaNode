"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import { Drawer } from "@/components/drawer";
import { EntregaCard } from "@/components/entrega-card";
import { EntregaCreateForm, EntregaEditForm } from "@/components/forms";
import { CounterChip, EmptyState, FilterPill, PageHeader } from "@/components/layout";
import {
  createEntrega,
  deleteEntrega,
  updateEntrega,
} from "@/lib/actions";
import { tipoEntregaLabel } from "@/lib/labels";
import { daysUntil } from "@/lib/entrega-utils";

export type EntregaData = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: string;
  estado: EstadoEntrega;
  nota: number | null;
  materiaId: string;
  recurso: string | null;
  prioridad: string | null;
  materia: {
    id: string;
    nombre: string;
    codigo: string | null;
    profesor: string | null;
  };
};

type ViewMode = "semana" | "mes";

type OrdenEstado = "pendientes-primero" | "entregados-primero";

type DrawerState =
  | { mode: "create"; fecha?: string }
  | { mode: "edit"; entrega: EntregaData }
  | null;

const FILTROS = [
  { value: "", label: "Todos" },
  { value: "TP", label: "TPs" },
  { value: "PARCIAL", label: "Parciales" },
  { value: "FINAL", label: "Finales" },
] as const;

const ORDEN_ESTADO = [
  { value: "pendientes-primero" as const, label: "Pendientes arriba" },
  { value: "entregados-primero" as const, label: "Entregados arriba" },
];

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function fechaKey(fecha: string) {
  return fecha.slice(0, 10);
}

function parseFechaLocal(fecha: string) {
  return new Date(`${fechaKey(fecha)}T12:00:00`);
}

function dayKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function EntregasWorkspace({
  entregas: initialEntregas,
  materias,
  initialTipo = "",
  initialQ = "",
}: {
  entregas: EntregaData[];
  materias: { id: string; nombre: string }[];
  initialTipo?: string;
  initialQ?: string;
}) {
  const [view, setView] = useState<ViewMode>("semana");
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tipo, setTipo] = useState(initialTipo);
  const [q, setQ] = useState(initialQ);
  const [ordenEstado, setOrdenEstado] = useState<OrdenEstado>("pendientes-primero");

  const filtered = useMemo(() => {
    return initialEntregas.filter((e) => {
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
  }, [initialEntregas, tipo, q]);

  const pendientes = filtered.filter((e) => e.estado !== "ENTREGADO");
  const urgentes = pendientes.filter((e) => daysUntil(new Date(e.fecha)) < 2);
  const enSemana = pendientes.filter((e) => {
    const d = daysUntil(new Date(e.fecha));
    return d >= 2 && d <= 7;
  });
  const aTiempo = pendientes.filter((e) => daysUntil(new Date(e.fecha)) > 7);

  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const currentMonth = addMonths(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    monthOffset,
  );
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const entregasByDay = useMemo(() => {
    const map: Record<string, EntregaData[]> = {};
    filtered.forEach((e) => {
      const key = fechaKey(e.fecha);
      map[key] = map[key] ?? [];
      map[key].push(e);
    });
    return map;
  }, [filtered]);

  const listEntregas = useMemo(() => {
    const entregadoRank = (e: EntregaData) => (e.estado === "ENTREGADO" ? 1 : 0);
    return [...filtered].sort((a, b) => {
      const rankA = entregadoRank(a);
      const rankB = entregadoRank(b);
      if (rankA !== rankB) {
        return ordenEstado === "pendientes-primero" ? rankA - rankB : rankB - rankA;
      }
      return parseFechaLocal(a.fecha).getTime() - parseFechaLocal(b.fecha).getTime();
    });
  }, [filtered, ordenEstado]);

  const periodEntregas = useMemo(() => {
    if (view === "semana") {
      const ws = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
      const we = endOfWeek(ws, { weekStartsOn: 1 });
      return filtered.filter((e) => {
        const d = parseFechaLocal(e.fecha);
        return d >= ws && d <= we;
      });
    }
    if (selectedDate) return entregasByDay[selectedDate] ?? [];
    const cm = addMonths(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      monthOffset,
    );
    return filtered.filter((e) => isSameMonth(parseFechaLocal(e.fecha), cm));
  }, [filtered, view, weekOffset, monthOffset, selectedDate, entregasByDay]);

  const openCreate = (fecha?: string) => setDrawer({ mode: "create", fecha });
  const openEdit = (entrega: EntregaData) => setDrawer({ mode: "edit", entrega });
  const closeDrawer = () => setDrawer(null);

  const handleDelete = async (entrega: EntregaData) => {
    if (!confirm(`¿Eliminar "${entrega.titulo}"?`)) return;
    const fd = new FormData();
    fd.set("id", entrega.id);
    await deleteEntrega({ success: true }, fd);
    closeDrawer();
  };

  return (
    <>
      <main className="relative min-w-0 space-y-8 overflow-x-clip pb-24">
        <PageHeader
          pill="Todas tus entregas"
        title="Entregas"
        description="Gestioná TPs, parciales y finales con vistas de lista, semana y mes."
        />

        <div className="flex flex-wrap items-center gap-2">
          <CounterChip tone="danger" count={urgentes.length} label="Urgentes" />
          <CounterChip tone="warning" count={enSemana.length} label="Esta semana" />
          <CounterChip tone="success" count={aTiempo.length} label="A tiempo" />
        </div>

        <div className="filter-scroll-row">
          {FILTROS.map((f) => (
            <FilterPill
              key={f.value}
              active={tipo === f.value}
              onClick={() => setTipo(f.value)}
              type="button"
            >
              {f.label}
            </FilterPill>
          ))}
        </div>

        <div className="filter-scroll-row items-center">
          <span className="shrink-0 text-xs text-muted">Orden:</span>
          {ORDEN_ESTADO.map((o) => (
            <FilterPill
              key={o.value}
              active={ordenEstado === o.value}
              onClick={() => setOrdenEstado(o.value)}
              type="button"
            >
              {o.label}
            </FilterPill>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar entrega..."
            className="w-full rounded-full border border-border bg-surface-card py-2 pl-9 pr-3 text-sm text-primary placeholder:text-muted focus:border-border-accent focus:outline-none"
          />
        </div>

        {/* Tabs Semana / Mes */}
        <section className="space-y-4">
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {(
              [
                { key: "semana", label: "Semana" },
                { key: "mes", label: "Mes" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setView(tab.key)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  view === tab.key
                    ? "bg-accent text-white shadow-[var(--shadow-sm)]"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {view === "semana" ? (
            <div key="semana" className="entregas-view-enter space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-accent"
                  aria-label="Semana anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {format(weekStart, "d MMM", { locale: es })} –{" "}
                  {format(weekEnd, "d MMM yyyy", { locale: es })}
                </span>
                <button
                  type="button"
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-accent"
                  aria-label="Semana siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 md:hidden">
                {weekDays.map((day) => {
                  const key = dayKey(day);
                  const dayEntregas = entregasByDay[key] ?? [];
                  const today = isToday(day);
                  const dayIndex = getDay(day) === 0 ? 6 : getDay(day) - 1;

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-3 ${
                        today
                          ? "border-accent bg-accent-ghost"
                          : "border-border bg-surface-card"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase text-secondary">
                            {dayNames[dayIndex]}
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              today ? "text-accent" : "text-primary"
                            }`}
                          >
                            {format(day, "d MMM", { locale: es })}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openCreate(key)}
                          aria-label={`Agregar entrega el ${format(day, "d MMM", { locale: es })}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-hover"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {dayEntregas.length > 0 ? (
                        <div className="space-y-1">
                          {dayEntregas.map((e) => (
                            <button
                              key={e.id}
                              type="button"
                              onClick={() => openEdit(e)}
                              className={`block w-full rounded-lg px-2 py-2 text-left text-sm transition hover:bg-surface-hover ${
                                e.estado === "ENTREGADO"
                                  ? "text-muted line-through"
                                  : "text-primary"
                              }`}
                            >
                              {e.titulo}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted">Sin entregas</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden grid-cols-7 gap-1.5 md:grid">
                {weekDays.map((day) => {
                  const key = dayKey(day);
                  const dayEntregas = entregasByDay[key] ?? [];
                  const today = isToday(day);

                  return (
                    <div
                      key={key}
                      className={`group/day relative min-h-[88px] rounded-xl border p-2 transition ${
                        today
                          ? "border-accent bg-accent-ghost"
                          : "border-border bg-surface-card"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase text-secondary">
                          {dayNames[getDay(day) === 0 ? 6 : getDay(day) - 1]}
                        </p>
                        <button
                          type="button"
                          onClick={() => openCreate(key)}
                          title="Agregar entrega"
                          aria-label={`Agregar entrega el ${format(day, "d MMM", { locale: es })}`}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white opacity-100 transition hover:bg-accent-hover sm:opacity-0 sm:group-hover/day:opacity-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p
                        className={`mb-1.5 text-center text-sm font-bold ${
                          today ? "text-accent" : "text-primary"
                        }`}
                      >
                        {format(day, "d")}
                      </p>
                      <div className="space-y-0.5">
                        {dayEntregas.slice(0, 2).map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => openEdit(e)}
                            className={`block w-full truncate rounded px-1 py-0.5 text-left text-[10px] transition hover:bg-surface-hover ${
                              e.estado === "ENTREGADO"
                                ? "text-muted line-through"
                                : "text-primary"
                            }`}
                          >
                            {e.titulo}
                          </button>
                        ))}
                        {dayEntregas.length > 2 && (
                          <p className="text-center text-[10px] text-muted">
                            +{dayEntregas.length - 2}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div key="mes" className="entregas-view-enter space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMonthOffset((o) => o - 1);
                    setSelectedDate(null);
                  }}
                  className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-accent"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMonthOffset((o) => o + 1);
                    setSelectedDate(null);
                  }}
                  className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-accent"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto overscroll-x-contain">
                <div className="grid min-w-[560px] grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
                {dayNames.map((name) => (
                  <div
                    key={name}
                    className="bg-surface-card px-2 py-1.5 text-center text-[10px] font-semibold uppercase text-secondary"
                  >
                    {name}
                  </div>
                ))}
                {monthDays.map((day) => {
                  const key = dayKey(day);
                  const dayEntregas = entregasByDay[key] ?? [];
                  const inMonth = isSameMonth(day, currentMonth);
                  const today = isToday(day);
                  const selected = selectedDate === key;

                  return (
                    <div
                      key={key}
                      className={`group/day relative min-h-[88px] px-1.5 py-2 transition ${
                        !inMonth
                          ? "bg-surface text-muted"
                          : selected
                            ? "bg-accent-ghost text-accent"
                            : today
                              ? "bg-surface-hover text-primary"
                              : "bg-surface-card text-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedDate(key)}
                          className={`text-xs font-medium leading-6 ${
                            today && !selected
                              ? "flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </button>
                        {inMonth && (
                          <button
                            type="button"
                            onClick={() => openCreate(key)}
                            title="Agregar entrega"
                            aria-label={`Agregar entrega el ${format(day, "d MMM", { locale: es })}`}
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white opacity-100 transition hover:bg-accent-hover sm:opacity-0 sm:group-hover/day:opacity-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {dayEntregas.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap justify-center gap-1 px-0.5">
                          {dayEntregas.slice(0, 4).map((e, i) => (
                            <span
                              key={i}
                              className={`inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10 sm:h-3 sm:w-3 ${
                                e.tipo === "TP"
                                  ? "bg-accent"
                                  : e.tipo === "PARCIAL"
                                    ? "bg-warning"
                                    : "bg-danger"
                              } ${e.estado === "ENTREGADO" ? "opacity-40" : ""}`}
                              title={e.titulo}
                            />
                          ))}
                          {dayEntregas.length > 4 && (
                            <span className="text-[9px] font-medium text-muted">
                              +{dayEntregas.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </div>

              {selectedDate && (
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {format(new Date(selectedDate + "T12:00:00"), "EEEE d 'de' MMMM", {
                    locale: es,
                  })}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Listado completo — siempre visible, como antes */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-primary">
              {tipo
                ? `${tipoEntregaLabel[tipo as TipoEntrega]}s`
                : "Todas las entregas"}
              <span className="ml-2 font-normal text-muted">({listEntregas.length})</span>
            </h2>
            {periodEntregas.length > 0 && periodEntregas.length !== listEntregas.length && (
              <span className="text-xs text-muted">
                {view === "semana"
                  ? `${periodEntregas.length} en esta semana`
                  : selectedDate
                    ? `${periodEntregas.length} en el día seleccionado`
                    : `${periodEntregas.length} en ${format(currentMonth, "MMMM", { locale: es })}`}
              </span>
            )}
          </div>

          {listEntregas.length > 0 ? (
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {listEntregas.map((e) => (
                <EntregaCard
                  key={e.id}
                  entrega={{ ...e, fecha: e.fecha }}
                  interactive
                  onOpen={() => openEdit(e)}
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

      {/* Drawer crear — contextual desde calendario (fecha pre-cargada) */}
      <Drawer
        open={drawer?.mode === "create"}
        onClose={closeDrawer}
        subtitle="Nueva entrega"
        title="Agregar entrega"
      >
        <EntregaCreateForm
          action={createEntrega}
          materias={materias}
          defaultFecha={drawer?.mode === "create" ? drawer.fecha : undefined}
          onSuccess={closeDrawer}
          compact
        />
      </Drawer>

      {/* Drawer editar */}
      <Drawer
        open={drawer?.mode === "edit"}
        onClose={closeDrawer}
        subtitle="Editar entrega"
        title={drawer?.mode === "edit" ? drawer.entrega.titulo : ""}
      >
        {drawer?.mode === "edit" && (
          <EntregaEditForm
            action={updateEntrega}
            materias={materias}
            compact
            onSuccess={closeDrawer}
            onDelete={() => handleDelete(drawer.entrega)}
            defaultValues={{
              id: drawer.entrega.id,
              titulo: drawer.entrega.titulo,
              tipo: drawer.entrega.tipo,
              fecha: drawer.entrega.fecha.slice(0, 10),
              estado: drawer.entrega.estado,
              nota: drawer.entrega.nota,
              materiaId: drawer.entrega.materiaId,
              recurso: drawer.entrega.recurso,
              prioridad: drawer.entrega.prioridad,
            }}
          />
        )}
      </Drawer>
    </>
  );
}
