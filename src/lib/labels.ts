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
    "border-[color:var(--accent)]/30 bg-accent-ghost text-accent",
  PARA_FINALIZAR:
    "border-[color:var(--warning)]/30 bg-warning-ghost text-warning",
  REGULAR:
    "border-[color:var(--accent)]/30 bg-accent-ghost text-accent",
  FINALIZADA:
    "border-[color:var(--success)]/30 bg-success-ghost text-success",
};

export const estadoMateriaTone: Record<
  EstadoMateria,
  "accent" | "warning" | "success" | "neutral"
> = {
  CURSANDO: "accent",
  PARA_FINALIZAR: "warning",
  REGULAR: "accent",
  FINALIZADA: "success",
};

export const tipoEntregaColor: Record<TipoEntrega, string> = {
  TP: "border-[color:var(--accent)]/30 bg-accent-ghost text-accent",
  PARCIAL: "border-[color:var(--warning)]/30 bg-warning-ghost text-warning",
  FINAL: "border-[color:var(--danger)]/30 bg-danger-ghost text-danger",
};
