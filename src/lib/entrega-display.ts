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
  TP: "border-[color-mix(in_oklch,var(--accent)_35%,transparent)] bg-[color-mix(in_oklch,#c084fc_16%,transparent)] text-[#d8b4fe]",
  PARCIAL:
    "border-[color-mix(in_oklch,var(--warning)_35%,transparent)] bg-warning-ghost text-warning",
  FINAL:
    "border-[color-mix(in_oklch,var(--danger)_35%,transparent)] bg-danger-ghost text-danger",
};

export const estadoEntregaNotionClass = {
  PENDIENTE: "border-border bg-surface-hover text-secondary",
  EN_CURSO:
    "border-[color-mix(in_oklch,var(--accent)_35%,transparent)] bg-accent-ghost text-accent",
  ENTREGADO:
    "border-[color-mix(in_oklch,var(--success)_35%,transparent)] bg-success-ghost text-success",
} as const;
