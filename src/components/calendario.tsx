"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import {
  estadoEntregaLabel,
  tipoEntregaColor,
  tipoEntregaLabel,
} from "@/lib/labels";

type EntregaItem = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: Date;
  estado: EstadoEntrega;
  materia: { nombre: string; codigo?: string | null };
};

type ViewMode = "lista" | "semana" | "mes";

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// ── Shared row ─────────────────────────────────────────────

export function EntregaRow({ entrega }: { entrega: EntregaItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-primary">
          {entrega.materia.codigo && (
            <span className="mr-1.5 rounded border border-border-strong bg-surface-hover px-1.5 py-px font-mono text-[10px] font-semibold text-secondary">
              {entrega.materia.codigo}
            </span>
          )}
          {entrega.titulo}
        </p>
        <p className="truncate text-xs text-muted">{entrega.materia.nombre}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${tipoEntregaColor[entrega.tipo]}`}
        >
          {tipoEntregaLabel[entrega.tipo]}
        </span>
        <span className="text-xs text-secondary">
          {format(entrega.fecha, "d MMM yyyy", { locale: es })}
        </span>
        <span className="text-[10px] text-muted">
          {estadoEntregaLabel[entrega.estado]}
        </span>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────

function EmptyCalendar() {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      No hay entregas programadas. Agregá TP, parciales o finales desde Entregas.
    </p>
  );
}

// ── View: Lista ────────────────────────────────────────────

function VistaLista({ entregas }: { entregas: EntregaItem[] }) {
  const byDate = entregas.reduce<Record<string, EntregaItem[]>>((acc, e) => {
    const key = format(e.fecha, "yyyy-MM-dd");
    acc[key] = acc[key] ?? [];
    acc[key].push(e);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  if (dates.length === 0) return <EmptyCalendar />;

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
            {format(new Date(date + "T12:00:00"), "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <div className="space-y-2">
            {byDate[date].map((entrega) => (
              <EntregaRow key={entrega.id} entrega={entrega} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── View: Semana ───────────────────────────────────────────

function VistaSemana({ entregas }: { entregas: EntregaItem[] }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const entregasByDay = useMemo(() => {
    const map: Record<string, EntregaItem[]> = {};
    days.forEach((d) => {
      map[format(d, "yyyy-MM-dd")] = [];
    });
    entregas.forEach((e) => {
      const key = format(e.fecha, "yyyy-MM-dd");
      if (map[key]) map[key].push(e);
    });
    return map;
  }, [entregas, days]);

  const hasAny = Object.values(entregasByDay).some((arr) => arr.length > 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {format(weekStart, "d MMM", { locale: es })} –{" "}
          {format(weekEnd, "d MMM yyyy", { locale: es })}
        </span>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover hover:text-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {!hasAny && <EmptyCalendar />}

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEntregas = entregasByDay[key] ?? [];
          const today = isToday(day);

          return (
            <div
              key={key}
              className={`rounded-lg border p-2 ${
                today
                  ? "border-accent bg-accent-ghost"
                  : "border-border bg-surface"
              }`}
            >
              <p className="mb-1 text-center text-[10px] font-semibold uppercase text-secondary">
                {dayNames[getDay(day) === 0 ? 6 : getDay(day) - 1]}
              </p>
              <p
                className={`mb-1.5 text-center text-sm font-bold ${
                  today ? "text-accent" : "text-primary"
                }`}
              >
                {format(day, "d")}
              </p>
              <div className="space-y-1">
                {dayEntregas.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="truncate rounded bg-surface-hover px-1 py-0.5 text-[10px] text-primary"
                    title={`${e.materia.codigo ? `${e.materia.codigo} · ` : ""}${e.titulo} — ${e.materia.nombre}`}
                  >
                    {e.materia.codigo && (
                      <span className="mr-1 font-mono font-semibold text-secondary">
                        {e.materia.codigo}
                      </span>
                    )}
                    {e.titulo}
                  </div>
                ))}
                {dayEntregas.length > 3 && (
                  <p className="text-center text-[10px] text-muted">
                    +{dayEntregas.length - 3}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── View: Mes ──────────────────────────────────────────────

function VistaMes({ entregas }: { entregas: EntregaItem[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = addMonths(new Date(today.getFullYear(), today.getMonth(), 1), monthOffset);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const entregasByDay = useMemo(() => {
    const map: Record<string, EntregaItem[]> = {};
    entregas.forEach((e) => {
      const key = format(e.fecha, "yyyy-MM-dd");
      map[key] = map[key] ?? [];
      map[key].push(e);
    });
    return map;
  }, [entregas]);

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const selectedEntregas = selectedDate ? entregasByDay[selectedDate] ?? [] : [];
  const hasAny = Object.keys(entregasByDay).length > 0;

  if (!hasAny) return <EmptyCalendar />;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => { setMonthOffset((o) => o - 1); setSelectedDate(null); }}
          className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </span>
        <button
          onClick={() => { setMonthOffset((o) => o + 1); setSelectedDate(null); }}
          className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover hover:text-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {dayNames.map((name) => (
          <div
            key={name}
            className="bg-surface-card px-2 py-1.5 text-center text-[10px] font-semibold uppercase text-secondary"
          >
            {name}
          </div>
        ))}
        {weeks.flat().map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEntregas = entregasByDay[key] ?? [];
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const selected = selectedDate === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(dayEntregas.length > 0 ? key : null)}
              className={`relative px-1.5 py-2 text-xs transition ${
                !inMonth
                  ? "bg-surface text-muted"
                  : selected
                    ? "bg-accent-ghost text-accent"
                    : today
                      ? "bg-surface-hover text-primary"
                      : "bg-surface-card text-primary"
              } ${dayEntregas.length > 0 ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`mx-auto block w-6 rounded-full text-center text-xs font-medium leading-6 ${
                  today && !selected ? "bg-accent text-surface-card" : ""
                }`}
              >
                {format(day, "d")}
              </span>
              {dayEntregas.length > 0 && (
                <div className="mt-0.5 flex justify-center gap-0.5">
                  {dayEntregas.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        e.tipo === "TP"
                          ? "bg-accent"
                          : e.tipo === "PARCIAL"
                            ? "bg-warning"
                            : "bg-danger"
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedEntregas.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {format(new Date(selectedDate + "T12:00:00"), "EEEE d 'de' MMMM", {
              locale: es,
            })}
          </p>
          {selectedEntregas.map((e) => (
            <EntregaRow key={e.id} entrega={e} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main: CalendarioMes with view selector ─────────────────

export function CalendarioMes({ entregas }: { entregas: EntregaItem[] }) {
  const [view, setView] = useState<ViewMode>("lista");

  const tabs: { key: ViewMode; label: string }[] = [
    { key: "lista", label: "Lista" },
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mes" },
  ];

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 rounded-md px-3 py-1 text-xs font-medium transition ${
              view === tab.key
                ? "bg-accent text-white"
                : "text-secondary hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "lista" && <VistaLista entregas={entregas} />}
      {view === "semana" && <VistaSemana entregas={entregas} />}
      {view === "mes" && <VistaMes entregas={entregas} />}
    </div>
  );
}
