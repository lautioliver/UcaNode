import type { EstadoEntrega } from "@/generated/prisma/client";

type TrackingSnapshot = {
  fechaInicio: Date | null;
  fechaCompletada: Date | null;
};

export function notaForTipo(
  tipo: string,
  nota: number | null | undefined,
): number | null {
  return tipo === "PARCIAL" || tipo === "FINAL" ? (nota ?? null) : null;
}

export function applyEstadoTimestamps(
  prevEstado: EstadoEntrega | null,
  newEstado: EstadoEntrega,
  existing: TrackingSnapshot,
  now: Date = new Date(),
): Partial<TrackingSnapshot> {
  const patch: Partial<TrackingSnapshot> = {};

  if (newEstado === "EN_CURSO" && !existing.fechaInicio) {
    patch.fechaInicio = now;
  }

  if (newEstado === "PENDIENTE" && prevEstado === "EN_CURSO") {
    patch.fechaInicio = null;
  }

  if (newEstado === "ENTREGADO") {
    patch.fechaCompletada = now;
  }

  if (
    prevEstado === "ENTREGADO" &&
    (newEstado === "PENDIENTE" || newEstado === "EN_CURSO")
  ) {
    patch.fechaCompletada = null;
  }

  return patch;
}
