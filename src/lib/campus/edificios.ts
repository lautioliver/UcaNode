/**
 * Diccionario de ubicaciones del Campus Castañares (UCASAL).
 *
 * Las coordenadas son porcentajes relativos al asset
 * `public/images/mapa-ucasal-castanares.webp` (recorte del mapa oficial sin la
 * banda de leyenda). Se guardan en porcentaje y no en píxeles para que el
 * overlay de pines siga alineado en cualquier ancho de pantalla.
 *
 * Cada `x`/`y` apunta al centro de la cabeza del marcador ya dibujado en la
 * imagen oficial, así el resaltado del componente cae justo encima.
 */

export type CategoriaEdificio = "ACADEMICA" | "INSTITUCIONAL";

export interface EdificioCampus {
  id: number;
  /** Nombre completo del edificio. */
  nombre: string;
  /** Etiqueta corta de la unidad académica o dependencia. */
  unidadAcademica: string;
  categoria: CategoriaEdificio;
  /** Porcentaje horizontal sobre la imagen del mapa (0-100). */
  x: number;
  /** Porcentaje vertical sobre la imagen del mapa (0-100). */
  y: number;
}

export const EDIFICIO_ID_MIN = 1;
export const EDIFICIO_ID_MAX = 21;

export const MAPA_CAMPUS = {
  src: "/images/mapa-ucasal-castanares.webp",
  width: 2111,
  height: 1123,
  alt: "Mapa del Campus Castañares de UCASAL con los edificios numerados",
  atribucion: "Mapa oficial de UCASAL",
  fuente: "https://www.ucasal.edu.ar/mapa-campus",
} as const;

export const EDIFICIOS_UCASAL: Record<number, EdificioCampus> = {
  1: {
    id: 1,
    nombre: "Facultad de Ciencias Jurídicas",
    unidadAcademica: "Jurídicas",
    categoria: "ACADEMICA",
    x: 87.49,
    y: 36.42,
  },
  2: {
    id: 2,
    nombre: "Facultad de Economía y Administración",
    unidadAcademica: "Economía",
    categoria: "ACADEMICA",
    x: 66.37,
    y: 34.64,
  },
  3: {
    id: 3,
    nombre: "Facultad de Ingeniería",
    unidadAcademica: "Ingeniería",
    categoria: "ACADEMICA",
    x: 64.28,
    y: 21.55,
  },
  4: {
    id: 4,
    nombre: "Facultad de Arquitectura",
    unidadAcademica: "Arquitectura",
    categoria: "ACADEMICA",
    x: 63.57,
    y: 12.38,
  },
  5: {
    id: 5,
    nombre: "Esc. de Turismo · Fac. de Salud · Fac. de Educación",
    unidadAcademica: "Turismo / Salud / Educación",
    categoria: "ACADEMICA",
    x: 67.98,
    y: 5.88,
  },
  6: {
    id: 6,
    nombre: "Facultad de Ciencias Agrarias y Veterinarias",
    unidadAcademica: "Agrarias y Veterinarias",
    categoria: "ACADEMICA",
    x: 76.22,
    y: 2.4,
  },
  7: {
    id: 7,
    nombre: "Facultad de Artes y Ciencias",
    unidadAcademica: "Artes y Ciencias",
    categoria: "ACADEMICA",
    x: 93.75,
    y: 16.92,
  },
  8: {
    id: 8,
    nombre: "Usos Múltiples I",
    unidadAcademica: "Aulas generales",
    categoria: "ACADEMICA",
    x: 90.72,
    y: 9.44,
  },
  9: {
    id: 9,
    nombre: "Usos Múltiples II · Esc. de Teología y Filosofía",
    unidadAcademica: "Aulas generales",
    categoria: "ACADEMICA",
    x: 46.66,
    y: 7.84,
  },
  10: {
    id: 10,
    nombre: "Esc. de Educación Física · Esc. de Trabajo Social",
    unidadAcademica: "Ed. Física / Trabajo Social",
    categoria: "ACADEMICA",
    x: 51.23,
    y: 51.78,
  },
  11: {
    id: 11,
    nombre: "Escuela de Música",
    unidadAcademica: "Música",
    categoria: "ACADEMICA",
    x: 11.04,
    y: 92.7,
  },
  12: {
    id: 12,
    nombre: "Departamento de Alumnos",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 93.27,
    y: 21.82,
  },
  13: {
    id: 13,
    nombre: "Dirección de Becas",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 89.67,
    y: 23.95,
  },
  14: {
    id: 14,
    nombre: "Estudio de Radio y TV",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 96.07,
    y: 14.96,
  },
  15: {
    id: 15,
    nombre: "Secretaría General",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 90.34,
    y: 42.56,
  },
  16: {
    id: 16,
    nombre: "Vicerrectorado de Extensión e Integración Universitaria",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 88.44,
    y: 40.25,
  },
  17: {
    id: 17,
    nombre: "Vicerrectorado de Formación",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 87.87,
    y: 22.8,
  },
  18: {
    id: 18,
    nombre: "Consejo de Investigaciones",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 65.56,
    y: 4.36,
  },
  19: {
    id: 19,
    nombre: "Dirección de Vida Universitaria",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 91.35,
    y: 22.48,
  },
  20: {
    id: 20,
    nombre: "COEDU",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 59.64,
    y: 26.89,
  },
  21: {
    id: 21,
    nombre: "Hospital de Pequeños y Grandes Animales",
    unidadAcademica: "Institucional",
    categoria: "INSTITUCIONAL",
    x: 73.4,
    y: 3.96,
  },
};

export const EDIFICIOS_LISTA: EdificioCampus[] = Object.values(
  EDIFICIOS_UCASAL,
).sort((a, b) => a.id - b.id);

export function esEdificioValido(id: unknown): id is number {
  return (
    typeof id === "number" &&
    Number.isInteger(id) &&
    id >= EDIFICIO_ID_MIN &&
    id <= EDIFICIO_ID_MAX
  );
}

export function getEdificio(id: number | null | undefined) {
  if (!esEdificioValido(id)) return null;
  return EDIFICIOS_UCASAL[id] ?? null;
}

export type CategoriaPunto = "SERVICIO" | "REFERENCIA" | "DEPORTE";

export interface PuntoCampus {
  id: string;
  nombre: string;
  categoria: CategoriaPunto;
  x: number;
  y: number;
  /** Alias normalizados para cruzar con los nombres de zona de CampuStatus. */
  alias: string[];
}

export const PUNTOS_CAMPUS: PuntoCampus[] = [
  {
    id: "biblioteca",
    nombre: "Biblioteca",
    categoria: "REFERENCIA",
    x: 80.58,
    y: 25.38,
    alias: ["biblioteca", "sala de lectura"],
  },
  {
    id: "aula-magna",
    nombre: "Aula Magna",
    categoria: "REFERENCIA",
    x: 69.02,
    y: 28.76,
    alias: ["aula magna", "magna"],
  },
  {
    id: "rectorado",
    nombre: "Rectorado",
    categoria: "REFERENCIA",
    x: 93.46,
    y: 45.28,
    alias: ["rectorado"],
  },
  {
    id: "capilla",
    nombre: "Capilla",
    categoria: "REFERENCIA",
    x: 82.31,
    y: 11.75,
    alias: ["capilla"],
  },
  {
    id: "salon-icaro",
    nombre: "Salón Ícaro",
    categoria: "REFERENCIA",
    x: 56.99,
    y: 65.41,
    alias: ["salon icaro", "icaro"],
  },
  {
    id: "administracion",
    nombre: "Administración General",
    categoria: "REFERENCIA",
    x: 43.6,
    y: 34.46,
    alias: ["administracion"],
  },
  {
    id: "eucasa",
    nombre: "EUCASA (editorial)",
    categoria: "REFERENCIA",
    x: 63,
    y: 2.67,
    alias: ["eucasa", "editorial"],
  },
  {
    id: "museo-pajcha",
    nombre: "Museo Pajcha UCASAL",
    categoria: "REFERENCIA",
    x: 79.18,
    y: 29.25,
    alias: ["museo", "pajcha"],
  },
  {
    id: "plazoleta-tavella",
    nombre: "Plazoleta Mons. Tavella",
    categoria: "REFERENCIA",
    x: 74.87,
    y: 12.6,
    alias: ["plazoleta", "tavella"],
  },
  {
    id: "virgen-sonrisa",
    nombre: "Virgen de la Sonrisa",
    categoria: "REFERENCIA",
    x: 97.3,
    y: 65.18,
    alias: ["virgen de la sonrisa"],
  },
  {
    id: "enfermeria",
    nombre: "Enfermería",
    categoria: "SERVICIO",
    x: 61.06,
    y: 28.85,
    alias: ["enfermeria"],
  },
  {
    id: "confiteria",
    nombre: "Confitería",
    categoria: "SERVICIO",
    x: 59.07,
    y: 68.21,
    alias: ["confiteria", "buffet", "bufet", "cantina", "comedor"],
  },
  {
    id: "kiosco-saludable",
    nombre: "Kiosco saludable",
    categoria: "SERVICIO",
    x: 72.1,
    y: 10.15,
    alias: ["kiosco", "kiosko", "quiosco"],
  },
  {
    id: "foodtrucks",
    nombre: "Foodtrucks",
    categoria: "SERVICIO",
    x: 85.88,
    y: 5.7,
    alias: ["foodtruck", "foodtrucks"],
  },
  {
    id: "fotocopias-oeste",
    nombre: "Fotocopias (Ed. Física)",
    categoria: "SERVICIO",
    x: 49.27,
    y: 50.22,
    alias: [],
  },
  {
    id: "fotocopias-este",
    nombre: "Fotocopias (Biblioteca)",
    categoria: "SERVICIO",
    x: 85.74,
    y: 22.35,
    alias: ["fotocopias", "fotocopiadora"],
  },
  {
    id: "ploteos",
    nombre: "Ploteos",
    categoria: "SERVICIO",
    x: 59.59,
    y: 14.87,
    alias: ["ploteos", "plotter"],
  },
  {
    id: "cajero-sur",
    nombre: "Cajero automático (Salón Ícaro)",
    categoria: "SERVICIO",
    x: 66.3,
    y: 83.04,
    alias: ["cajero", "cajero automatico"],
  },
  {
    id: "cajero-oeste",
    nombre: "Cajero automático (playón)",
    categoria: "SERVICIO",
    x: 55.68,
    y: 95.77,
    alias: [],
  },
  {
    id: "libreria",
    nombre: "Librería",
    categoria: "SERVICIO",
    x: 64.57,
    y: 84.86,
    alias: ["libreria"],
  },
  {
    id: "tienda-ucasal",
    nombre: "Tienda UCASAL",
    categoria: "SERVICIO",
    x: 60,
    y: 90.07,
    alias: ["tienda"],
  },
  {
    id: "parada-colectivo",
    nombre: "Parada de colectivo",
    categoria: "SERVICIO",
    x: 62.03,
    y: 93.19,
    alias: ["parada", "colectivo"],
  },
  {
    id: "gimnasio",
    nombre: "Gimnasio",
    categoria: "SERVICIO",
    x: 26.98,
    y: 63.98,
    alias: ["gimnasio", "gym"],
  },
  {
    id: "complejo-deportivo",
    nombre: "Complejo deportivo",
    categoria: "DEPORTE",
    x: 19.19,
    y: 47.15,
    alias: ["complejo deportivo"],
  },
  {
    id: "estacion-deportiva",
    nombre: "Estación Deportiva",
    categoria: "DEPORTE",
    x: 37.49,
    y: 32.95,
    alias: ["estacion deportiva"],
  },
  {
    id: "piscina",
    nombre: "Piscina",
    categoria: "DEPORTE",
    x: 20.72,
    y: 78.01,
    alias: ["piscina", "natatorio", "pileta"],
  },
  {
    id: "cancha-rugby",
    nombre: "Cancha de rugby",
    categoria: "DEPORTE",
    x: 33.47,
    y: 21.73,
    alias: ["rugby"],
  },
  {
    id: "cancha-voley",
    nombre: "Cancha de vóley",
    categoria: "DEPORTE",
    x: 43.89,
    y: 54.14,
    alias: ["voley", "volley"],
  },
];

export const categoriaPuntoLabel: Record<CategoriaPunto, string> = {
  SERVICIO: "Servicios",
  REFERENCIA: "Referencias",
  DEPORTE: "Deportes",
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Cruza el nombre de una zona de CampuStatus con un punto del mapa.
 * Devuelve `null` cuando no hay coincidencia, así la capa de ocupación
 * simplemente no se dibuja en lugar de romper la vista.
 */
export function buscarPuntoPorZona(nombreZona: string): PuntoCampus | null {
  const zona = normalizar(nombreZona);
  if (!zona) return null;

  for (const punto of PUNTOS_CAMPUS) {
    if (normalizar(punto.nombre) === zona) return punto;
  }

  for (const punto of PUNTOS_CAMPUS) {
    for (const alias of punto.alias) {
      const clave = normalizar(alias);
      if (clave && (zona.includes(clave) || clave.includes(zona))) return punto;
    }
  }

  return null;
}
