import { z } from "zod";

export const EstadoMateria = z.enum([
  "CURSANDO",
  "PARA_FINALIZAR",
  "REGULAR",
  "FINALIZADA",
]);

export const TipoEntrega = z.enum(["TP", "PARCIAL", "FINAL"]);

export const EstadoEntrega = z.enum(["PENDIENTE", "EN_CURSO", "ENTREGADO"]);

export const DiaSemana = z.enum([
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
]);

export const Modalidad = z.enum(["PRESENCIAL", "VIRTUAL"]);

export const CategoriaLink = z.enum([
  "GOOGLE_DRIVE",
  "PLATAFORMA_UCASAL",
  "GITHUB",
  "OTRO",
]);

export const materiaSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  codigo: z.string().nullable().optional(),
  estado: EstadoMateria.default("CURSANDO"),
  cuatrimestre: z.coerce.number().int().nullable().optional(),
  anio: z.coerce.number().int().nullable().optional(),
  profesor: z.string().nullable().optional(),
  semestre: z.string().nullable().optional(),
  correlativas: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  promocional: z.boolean().optional(),
  dia: DiaSemana.nullable().optional(),
});

export const entregaSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(1, "El título es requerido"),
  tipo: TipoEntrega,
  fecha: z.coerce.date(),
  estado: EstadoEntrega.default("PENDIENTE"),
  nota: z.coerce
    .number()
    .min(0, "La nota mínima es 0")
    .max(10, "La nota máxima es 10")
    .nullable()
    .optional(),
  materiaId: z.string().min(1, "La materia es requerida"),
  recurso: z.string().nullable().optional(),
  prioridad: z.string().nullable().optional(),
});

export const horarioSchema = z.object({
  id: z.string().optional(),
  dia: DiaSemana,
  horaInicio: z.string().min(1, "Hora inicio requerida"),
  horaFin: z.string().min(1, "Hora fin requerida"),
  modalidad: Modalidad.default("PRESENCIAL"),
  aulaLink: z.string().nullable().optional(),
  materiaId: z.string().min(1, "La materia es requerida"),
});

export const linkSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  url: z.string().url("URL inválida").min(1, "La URL es requerida"),
  categoria: CategoriaLink.default("OTRO"),
  favorito: z.boolean().optional(),
});

export const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  emailUcasal: z.string().email("Email inválido"),
  anioIngreso: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido")
    .max(2100, "Año inválido"),
  legajo: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
});

export const onboardingCarreraSchema = z.object({
  perfilId: z.string().min(1, "Perfil requerido"),
  carreraSlug: z.string().min(1, "Seleccioná una carrera"),
});
