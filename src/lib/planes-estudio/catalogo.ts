import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import { UNIVERSIDAD_DEFAULT_SLUG } from "@/lib/universidades/catalogo";
import planInformatica from "@/data/correlatividades.json";
import planArquitectura from "@/data/planes/arquitectura-2015.json";
import planIndustrial from "@/data/planes/ingenieria-industrial-2005.json";
import planPsicologia from "@/data/planes/licenciatura-en-psicologia-1114.json";
import planCivil from "@/data/planes/ingenieria-civil-2012.json";
import planTelecomunicaciones from "@/data/planes/ingenieria-en-telecomunicaciones-2012.json";
import planRrii from "@/data/planes/licenciatura-en-relaciones-internacionales-2026.json";

export const CARRERAS_DISPONIBLES: CarreraCatalogo[] = [
  {
    slug: "ingenieria-informatica-2015",
    nombre: planInformatica.carrera,
    planAnio: planInformatica.plan,
    resolucion: planInformatica.resolucion,
    modalidad: planInformatica.modalidad,
    duracionAnios: planInformatica.duracionAnios,
    descripcion: planInformatica.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "ingenieria-industrial-2005",
    nombre: planIndustrial.carrera,
    planAnio: planIndustrial.plan,
    resolucion: planIndustrial.resolucion,
    modalidad: planIndustrial.modalidad,
    duracionAnios: planIndustrial.duracionAnios,
    descripcion: planIndustrial.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "licenciatura-en-psicologia-1114",
    nombre: planPsicologia.carrera,
    planAnio: planPsicologia.plan,
    resolucion: planPsicologia.resolucion,
    modalidad: planPsicologia.modalidad,
    duracionAnios: planPsicologia.duracionAnios,
    descripcion: planPsicologia.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "arquitectura-2015",
    nombre: planArquitectura.carrera,
    planAnio: planArquitectura.plan,
    resolucion: planArquitectura.resolucion,
    modalidad: planArquitectura.modalidad,
    duracionAnios: planArquitectura.duracionAnios,
    descripcion: planArquitectura.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "ingenieria-civil-2012",
    nombre: planCivil.carrera,
    planAnio: planCivil.plan,
    resolucion: planCivil.resolucion,
    modalidad: planCivil.modalidad,
    duracionAnios: planCivil.duracionAnios,
    descripcion: planCivil.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "ingenieria-en-telecomunicaciones-2012",
    nombre: planTelecomunicaciones.carrera,
    planAnio: planTelecomunicaciones.plan,
    resolucion: planTelecomunicaciones.resolucion,
    modalidad: planTelecomunicaciones.modalidad,
    duracionAnios: planTelecomunicaciones.duracionAnios,
    descripcion: planTelecomunicaciones.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
  {
    slug: "licenciatura-en-relaciones-internacionales-2026",
    nombre: planRrii.carrera,
    planAnio: planRrii.plan,
    resolucion: planRrii.resolucion,
    modalidad: planRrii.modalidad,
    duracionAnios: planRrii.duracionAnios,
    descripcion: planRrii.descripcion,
    universidadSlug: UNIVERSIDAD_DEFAULT_SLUG,
  },
];

export function getCarreraCatalogo(slug: string): CarreraCatalogo | null {
  return CARRERAS_DISPONIBLES.find((c) => c.slug === slug) ?? null;
}

export function listCarrerasDisponibles(): CarreraCatalogo[] {
  return CARRERAS_DISPONIBLES;
}

export function listCarrerasByUniversidad(universidadSlug: string): CarreraCatalogo[] {
  return CARRERAS_DISPONIBLES.filter((carrera) => carrera.universidadSlug === universidadSlug);
}
