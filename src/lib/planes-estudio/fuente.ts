import planInformatica from "@/data/correlatividades.json";
import type { PlanEstudioFuente } from "@/lib/planes-estudio/types";

const FUENTES: Record<string, PlanEstudioFuente> = {
  "ingenieria-informatica-2015": planInformatica as PlanEstudioFuente,
};

export function obtenerPlanDesdeFuente(slug: string): PlanEstudioFuente | null {
  return FUENTES[slug] ?? null;
}
