import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TipoEntrega } from "@/generated/prisma/client";

export function formatEntregaPageTitle(
  titulo: string,
  materia: { nombre: string; codigo: string | null },
): string {
  const prefix = materia.codigo?.trim() || materia.nombre.split(/\s+/)[0];
  return `${prefix} | ${titulo}`;
}

export function formatEntregaFechaLarga(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatEntregaHora(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return format(d, "HH:mm");
}

export const tipoEntregaNotionClass: Record<TipoEntrega, string> = {
  TP: "border-[color:var(--accent)]/30 bg-accent-ghost text-accent",
  PARCIAL: "border-[color:var(--warning)]/30 bg-warning-ghost text-warning",
  FINAL: "border-[color:var(--danger)]/30 bg-danger-ghost text-danger",
};

export const tipoEntregaTileClass: Record<TipoEntrega, string> = {
  TP: "bg-accent-ghost text-accent",
  PARCIAL: "bg-warning-ghost text-warning",
  FINAL: "bg-danger-ghost text-danger",
};

export const estadoEntregaNotionClass = {
  PENDIENTE: "border-border bg-surface text-secondary",
  EN_CURSO: "border-[color:var(--warning)]/30 bg-warning-ghost text-warning",
  ENTREGADO: "border-[color:var(--success)]/30 bg-success-ghost text-success",
} as const;
