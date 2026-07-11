import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import planInformatica from "@/data/correlatividades.json";
import planIndustrial from "@/data/planes/ingenieria-industrial-2005.json";

export const CARRERAS_DISPONIBLES: CarreraCatalogo[] = [
  {
    slug: "ingenieria-informatica-2015",
    nombre: planInformatica.carrera,
    planAnio: planInformatica.plan,
    resolucion: planInformatica.resolucion,
    modalidad: planInformatica.modalidad,
    duracionAnios: planInformatica.duracionAnios,
    descripcion: planInformatica.descripcion,
  },
  {
    slug: "ingenieria-industrial-2005",
    nombre: planIndustrial.carrera,
    planAnio: planIndustrial.plan,
    resolucion: planIndustrial.resolucion,
    modalidad: planIndustrial.modalidad,
    duracionAnios: planIndustrial.duracionAnios,
    descripcion: planIndustrial.descripcion,
  },
];

export function getCarreraCatalogo(slug: string): CarreraCatalogo | null {
  return CARRERAS_DISPONIBLES.find((c) => c.slug === slug) ?? null;
}

export function listCarrerasDisponibles(): CarreraCatalogo[] {
  return CARRERAS_DISPONIBLES;
}
