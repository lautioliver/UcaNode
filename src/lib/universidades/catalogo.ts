import type { UniversidadCatalogo } from "@/lib/universidades/types";

export const UNIVERSIDAD_DEFAULT_SLUG = "ucasal";

export const UNIVERSIDADES: UniversidadCatalogo[] = [
  {
    slug: UNIVERSIDAD_DEFAULT_SLUG,
    nombre: "Universidad Católica de Salta",
    nombreCorto: "UCASAL",
    estado: "activa",
    tagline: "Autogestión para estudiantes de la Ucasal.",
    descripcion:
      "UcaNode ya está disponible para estudiantes de la Universidad Católica de Salta: materias, entregas, horarios y comunidad en un solo panel.",
    sitioOficial: "https://www.ucasal.edu.ar",
    novedades: [],
  },
  {
    slug: "unsa",
    nombre: "Universidad Nacional de Salta",
    nombreCorto: "UNSa",
    estado: "en_construccion",
    tagline: "Autogestión para estudiantes de la UNSa, en camino.",
    descripcion:
      "Estamos armando el espacio de UcaNode para la Universidad Nacional de Salta: catálogo de carreras, planes de estudio y onboarding. Esta página es el punto de novedades mientras tanto.",
    sitioOficial: "https://www.unsa.edu.ar",
    novedades: [
      {
        fecha: "2026-08-18",
        titulo: "Abrimos el espacio UNSa",
        cuerpo:
          "Publicamos esta página para que puedas seguir el avance. Todavía no hay registro ni carreras: el producto activo sigue siendo UCASAL.",
      },
      {
        fecha: "2026-08-18",
        titulo: "Próximo paso: catálogo de carreras",
        cuerpo:
          "El trabajo siguiente es relevar planes de estudio y cargarlos con el mismo modelo que ya usamos en UCASAL.",
      },
    ],
  },
];

export function getUniversidad(slug: string): UniversidadCatalogo | null {
  return UNIVERSIDADES.find((universidad) => universidad.slug === slug) ?? null;
}

export function listUniversidades(): UniversidadCatalogo[] {
  return UNIVERSIDADES;
}

/** Hubs públicos que se renderizan (no redirigen a la landing activa). */
export function listUniversidadesPublicas(): UniversidadCatalogo[] {
  return UNIVERSIDADES.filter((universidad) => universidad.estado === "en_construccion");
}

export function getUniversidadNovedades(universidad: UniversidadCatalogo) {
  return [...universidad.novedades].sort((a, b) => b.fecha.localeCompare(a.fecha));
}
