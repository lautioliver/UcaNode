import type {
  DiaSemana,
  EstadoEntrega,
  TipoEntrega,
} from "@/generated/prisma/client";

export type Urgencia = "urgente" | "semana" | "aTiempo";

export type UrgenciaTone = "danger" | "warning" | "success";

export function urgenciaFromDays(daysRemaining: number): Urgencia {
  if (daysRemaining < 2) return "urgente";
  if (daysRemaining <= 7) return "semana";
  return "aTiempo";
}

export function daysUntil(date: Date, now = new Date()): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const startOfNow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  return Math.round((startOfTarget - startOfNow) / oneDay);
}

export const urgenciaTone: Record<Urgencia, UrgenciaTone> = {
  urgente: "danger",
  semana: "warning",
  aTiempo: "success",
};

export const urgenciaLabel: Record<Urgencia, string> = {
  urgente: "Urgente",
  semana: "Esta semana",
  aTiempo: "A tiempo",
};

export function humanDays(daysRemaining: number): string {
  if (daysRemaining < 0) {
    const abs = Math.abs(daysRemaining);
    return abs === 1 ? "Venció ayer" : `Vencida hace ${abs} días`;
  }
  if (daysRemaining === 0) return "Vence hoy";
  if (daysRemaining === 1) return "Vence mañana";
  if (daysRemaining <= 7) return `Vence en ${daysRemaining} días`;
  if (daysRemaining <= 30)
    return `En ${Math.round(daysRemaining / 7)} semanas`;
  return `En ${Math.round(daysRemaining / 30)} meses`;
}

export function progressToDeadline(
  daysRemaining: number,
  horizonDays = 30,
): number {
  if (daysRemaining <= 0) return 100;
  if (daysRemaining >= horizonDays) return 5;
  return Math.round((1 - daysRemaining / horizonDays) * 100);
}

export const tipoEntregaAccent: Record<TipoEntrega, "accent" | "warning" | "danger"> = {
  TP: "accent",
  PARCIAL: "warning",
  FINAL: "danger",
};

export const estadoEntregaTone: Record<EstadoEntrega, "neutral" | "warning" | "success"> = {
  PENDIENTE: "neutral",
  EN_CURSO: "warning",
  ENTREGADO: "success",
};

export const diaSemanaShort: Record<DiaSemana, string> = {
  LUNES: "Lun",
  MARTES: "Mar",
  MIERCOLES: "Mié",
  JUEVES: "Jue",
  VIERNES: "Vie",
};
