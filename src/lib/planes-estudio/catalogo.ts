import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import planInformatica from "@/data/correlatividades.json";
import planArquitectura from "@/data/planes/arquitectura-2015.json";
import planIndustrial from "@/data/planes/ingenieria-industrial-2005.json";
import planPsicologia from "@/data/planes/licenciatura-en-psicologia-1114.json";
import planCivil from "@/data/planes/ingenieria-civil-2012.json";

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
  {
    slug: "licenciatura-en-psicologia-1114",
    nombre: planPsicologia.carrera,
    planAnio: planPsicologia.plan,
    resolucion: planPsicologia.resolucion,
    modalidad: planPsicologia.modalidad,
    duracionAnios: planPsicologia.duracionAnios,
    descripcion: planPsicologia.descripcion,
  },
  {
    slug: "arquitectura-2015",
    nombre: planArquitectura.carrera,
    planAnio: planArquitectura.plan,
    resolucion: planArquitectura.resolucion,
    modalidad: planArquitectura.modalidad,
    duracionAnios: planArquitectura.duracionAnios,
    descripcion: planArquitectura.descripcion,
  },
  {
    slug: "ingenieria-civil-2012",
    nombre: planCivil.carrera,
    planAnio: planCivil.plan,
    resolucion: planCivil.resolucion,
    modalidad: planCivil.modalidad,
    duracionAnios: planCivil.duracionAnios,
    descripcion: planCivil.descripcion,
  },
];

export function getCarreraCatalogo(slug: string): CarreraCatalogo | null {
  return CARRERAS_DISPONIBLES.find((c) => c.slug === slug) ?? null;
}

export function listCarrerasDisponibles(): CarreraCatalogo[] {
  return CARRERAS_DISPONIBLES;
}
