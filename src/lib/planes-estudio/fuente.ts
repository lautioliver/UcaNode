import planInformatica from "@/data/correlatividades.json";
import planArquitectura from "@/data/planes/arquitectura-2015.json";
import planIndustrial from "@/data/planes/ingenieria-industrial-2005.json";
import planPsicologia from "@/data/planes/licenciatura-en-psicologia-1114.json";
import planCivil from "@/data/planes/ingenieria-civil-2012.json";
import type { PlanEstudioFuente } from "@/lib/planes-estudio/types";

const FUENTES: Record<string, PlanEstudioFuente> = {
  "ingenieria-informatica-2015": planInformatica as PlanEstudioFuente,
  "ingenieria-industrial-2005": planIndustrial as PlanEstudioFuente,
  "licenciatura-en-psicologia-1114": planPsicologia as PlanEstudioFuente,
  "arquitectura-2015": planArquitectura as PlanEstudioFuente,
  "ingenieria-civil-2012": planCivil as PlanEstudioFuente,
};

export function obtenerPlanDesdeFuente(slug: string): PlanEstudioFuente | null {
  return FUENTES[slug] ?? null;
}
