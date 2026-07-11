import type { TipoCorrelativa } from "@/generated/prisma/client";

export type CorrelativasCursar = {
  regularizadas: string[];
  aprobadas: string[];
};

export type MateriaPlanFuente = {
  codigo: string;
  codigoOficial: string;
  nombre: string;
  abreviatura: string;
  aliases: string[];
  anio: number;
  semestre: number;
  tipoDictado: string;
  creditos: number;
  correlativasCursar: CorrelativasCursar;
  correlativasRendir: string[];
};

export type PlanEstudioFuente = {
  carrera: string;
  plan: string;
  resolucion: string;
  modalidad: string;
  duracionAnios: number;
  descripcion: string;
  materias: MateriaPlanFuente[];
};

export type CarreraCatalogo = {
  slug: string;
  nombre: string;
  planAnio: string;
  resolucion: string;
  modalidad: string;
  duracionAnios: number;
  descripcion: string;
};

export type CorrelativaInsert = {
  materiaCodigo: string;
  requisitoCodigo: string;
  tipo: TipoCorrelativa;
};
