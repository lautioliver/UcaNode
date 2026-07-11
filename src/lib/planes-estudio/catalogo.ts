import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import planInformatica from "@/data/correlatividades.json";

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
];

export function getCarreraCatalogo(slug: string): CarreraCatalogo | null {
  return CARRERAS_DISPONIBLES.find((c) => c.slug === slug) ?? null;
}

export function listCarrerasDisponibles(): CarreraCatalogo[] {
  return CARRERAS_DISPONIBLES;
}
