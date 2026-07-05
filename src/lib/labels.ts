import {
  CategoriaLink,
  DiaSemana,
  EstadoEntrega,
  EstadoMateria,
  Modalidad,
  TipoEntrega,
} from "@/generated/prisma/client";

export const estadoMateriaLabel: Record<EstadoMateria, string> = {
  CURSANDO: "Cursando",
  PARA_FINALIZAR: "Para finalizar",
  REGULAR: "Regular",
  FINALIZADA: "Finalizada",
};

export const tipoEntregaLabel: Record<TipoEntrega, string> = {
  TP: "Trabajo Práctico",
  PARCIAL: "Parcial",
  FINAL: "Final",
};

export const estadoEntregaLabel: Record<EstadoEntrega, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  ENTREGADO: "Entregado",
};

export const diaSemanaLabel: Record<DiaSemana, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
};

export const modalidadLabel: Record<Modalidad, string> = {
  PRESENCIAL: "Presencial",
  VIRTUAL: "Virtual",
};

export const categoriaLinkLabel: Record<CategoriaLink, string> = {
  GOOGLE_DRIVE: "Google Drive",
  PLATAFORMA_UCASAL: "Plataforma Ucasal",
  GITHUB: "GitHub",
  OTRO: "Otro",
};

export const estadoMateriaColor: Record<EstadoMateria, string> = {
  CURSANDO:
    "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  PARA_FINALIZAR:
    "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  REGULAR:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  FINALIZADA:
    "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
};

export const tipoEntregaColor: Record<TipoEntrega, string> = {
  TP: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  PARCIAL: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  FINAL: "bg-red-500/15 text-red-700 dark:text-red-300",
};
