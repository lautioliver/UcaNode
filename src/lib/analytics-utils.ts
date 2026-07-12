import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import { tipoEntregaLabel } from "@/lib/labels";

export type EntregaAnalytics = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: Date | string;
  estado: EstadoEntrega;
  nota: number | null;
  fechaInicio: Date | string | null;
  fechaCompletada: Date | string | null;
  materia: {
    id: string;
    nombre: string;
    cuatrimestre: number | null;
  };
};

export type AnalyticsFilters = {
  materiaId?: string;
  cuatrimestre?: number | null;
};

export type AnalyticsKpis = {
  total: number;
  completadas: number;
  tasaCompletitud: number;
  aTiempo: number;
  aTiempoBase: number;
  tasaATiempo: number;
  promedioNotas: number | null;
  notasCargadas: number;
  duracionPromedioDias: number | null;
  duracionBase: number;
  porTipo: Record<TipoEntrega, number>;
};

export type MateriaEntregaCount = {
  materiaId: string;
  nombre: string;
  total: number;
  completadas: number;
};

export type EntregaConNota = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  tipoLabel: string;
  nota: number;
  materiaNombre: string;
  fecha: Date;
};

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterEntregas(
  entregas: EntregaAnalytics[],
  filters: AnalyticsFilters = {},
): EntregaAnalytics[] {
  return entregas.filter((entrega) => {
    if (filters.materiaId && entrega.materia.id !== filters.materiaId) {
      return false;
    }
    if (
      filters.cuatrimestre != null &&
      entrega.materia.cuatrimestre !== filters.cuatrimestre
    ) {
      return false;
    }
    return true;
  });
}

export function computeAnalyticsKpis(
  entregas: EntregaAnalytics[],
): AnalyticsKpis {
  const total = entregas.length;
  const completadas = entregas.filter((e) => e.estado === "ENTREGADO").length;
  const porTipo: Record<TipoEntrega, number> = { TP: 0, PARCIAL: 0, FINAL: 0 };

  for (const entrega of entregas) {
    porTipo[entrega.tipo] += 1;
  }

  const entregadasConFecha = entregas.filter(
    (e) => e.estado === "ENTREGADO" && e.fechaCompletada,
  );
  const aTiempo = entregadasConFecha.filter((e) => {
    const completada = startOfDay(toDate(e.fechaCompletada!));
    const vencimiento = startOfDay(toDate(e.fecha));
    return completada <= vencimiento;
  }).length;

  const conNota = entregas.filter(
    (e) =>
      (e.tipo === "PARCIAL" || e.tipo === "FINAL") &&
      e.nota != null,
  );
  const promedioNotas =
    conNota.length > 0
      ? conNota.reduce((sum, e) => sum + (e.nota ?? 0), 0) / conNota.length
      : null;

  const conDuracion = entregas.filter(
    (e) => e.fechaInicio && e.fechaCompletada,
  );
  const duracionPromedioDias =
    conDuracion.length > 0
      ? conDuracion.reduce((sum, e) => {
          const ms =
            toDate(e.fechaCompletada!).getTime() -
            toDate(e.fechaInicio!).getTime();
          return sum + ms / (1000 * 60 * 60 * 24);
        }, 0) / conDuracion.length
      : null;

  return {
    total,
    completadas,
    tasaCompletitud: total > 0 ? completadas / total : 0,
    aTiempo,
    aTiempoBase: entregadasConFecha.length,
    tasaATiempo:
      entregadasConFecha.length > 0
        ? aTiempo / entregadasConFecha.length
        : 0,
    promedioNotas,
    notasCargadas: conNota.length,
    duracionPromedioDias,
    duracionBase: conDuracion.length,
    porTipo,
  };
}

export function topMateriasByEntregas(
  entregas: EntregaAnalytics[],
  limit = 5,
): MateriaEntregaCount[] {
  const map = new Map<string, MateriaEntregaCount>();

  for (const entrega of entregas) {
    const existing = map.get(entrega.materia.id);
    if (existing) {
      existing.total += 1;
      if (entrega.estado === "ENTREGADO") existing.completadas += 1;
    } else {
      map.set(entrega.materia.id, {
        materiaId: entrega.materia.id,
        nombre: entrega.materia.nombre,
        total: 1,
        completadas: entrega.estado === "ENTREGADO" ? 1 : 0,
      });
    }
  }

  return [...map.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function entregasConNota(
  entregas: EntregaAnalytics[],
): EntregaConNota[] {
  return entregas
    .filter(
      (e) =>
        (e.tipo === "PARCIAL" || e.tipo === "FINAL") &&
        e.nota != null,
    )
    .map((e) => ({
      id: e.id,
      titulo: e.titulo,
      tipo: e.tipo,
      tipoLabel: tipoEntregaLabel[e.tipo],
      nota: e.nota!,
      materiaNombre: e.materia.nombre,
      fecha: toDate(e.fecha),
    }))
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatDays(value: number | null): string {
  if (value == null) return "—";
  if (value < 1) return "< 1 día";
  return `${value.toFixed(1)} días`;
}

export function formatNota(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(1);
}

export function uniqueCuatrimestres(
  entregas: EntregaAnalytics[],
): number[] {
  const values = new Set<number>();
  for (const entrega of entregas) {
    if (entrega.materia.cuatrimestre != null) {
      values.add(entrega.materia.cuatrimestre);
    }
  }
  return [...values].sort((a, b) => a - b);
}
