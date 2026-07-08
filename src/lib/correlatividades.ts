import planData from "@/data/correlatividades.json";

export type CorrelativasCursar = {
  regularizadas: string[];
  aprobadas: string[];
};

export type MateriaPlan = {
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

export type PlanEstudio = {
  carrera: string;
  plan: string;
  resolucion: string;
  modalidad: string;
  duracionAnios: number;
  descripcion: string;
  materias: MateriaPlan[];
};

export const planEstudio: PlanEstudio = planData as PlanEstudio;

/**
 * Normaliza un texto para comparación:
 * - lowercase
 * - remueve tildes/diacríticos
 * - reemplaza puntuación por espacios
 * - colapsa espacios
 * - convierte números romanos (i, ii, iii, iv) a arábigos
 */
export function normalize(text: string): string {
  if (!text) return "";
  let out = text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  out = out
    .replace(/\biv\b/g, "4")
    .replace(/\biii\b/g, "3")
    .replace(/\bii\b/g, "2")
    .replace(/\bi\b/g, "1");

  return out;
}

/**
 * Índice pre-computado: mapa de "clave normalizada" -> código de materia.
 * Incluye nombre oficial, abreviatura, código y todos los aliases.
 */
type IndexEntry = { codigo: string; source: "codigo" | "nombre" | "abreviatura" | "alias" };
const searchIndex: Map<string, IndexEntry> = (() => {
  const map = new Map<string, IndexEntry>();
  for (const m of planEstudio.materias) {
    const claves: Array<[string, IndexEntry["source"]]> = [
      [m.codigo, "codigo"],
      [m.codigoOficial, "codigo"],
      [m.nombre, "nombre"],
      [m.abreviatura, "abreviatura"],
      ...m.aliases.map((a) => [a, "alias"] as [string, IndexEntry["source"]]),
    ];
    for (const [raw, source] of claves) {
      const key = normalize(raw);
      if (!key) continue;
      if (!map.has(key)) map.set(key, { codigo: m.codigo, source });
    }
  }
  return map;
})();

const materiaByCodigo: Map<string, MateriaPlan> = new Map(
  planEstudio.materias.map((m) => [m.codigo, m]),
);

/**
 * Distancia de Levenshtein para tolerar errores de tipeo pequeños.
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[b.length];
}

/**
 * Busca la materia del plan que corresponde a un nombre/código ingresado por el usuario.
 * Retorna null si no hay match confiable.
 *
 * Estrategia (en orden):
 * 1. Match exacto sobre el índice normalizado (código, nombre oficial, abreviatura, alias).
 * 2. Match por prefijo (la entrada del usuario es prefijo de alguna clave, o viceversa).
 * 3. Match por distancia de Levenshtein (tolera hasta ~15% de caracteres de diferencia).
 */
export function findMateriaByName(input: string | null | undefined): MateriaPlan | null {
  if (!input) return null;
  const key = normalize(input);
  if (!key) return null;

  const exact = searchIndex.get(key);
  if (exact) return materiaByCodigo.get(exact.codigo) ?? null;

  let bestPrefix: { codigo: string; score: number } | null = null;
  for (const [candidateKey, entry] of searchIndex) {
    if (candidateKey === key) continue;
    if (candidateKey.startsWith(key) || key.startsWith(candidateKey)) {
      const score = Math.abs(candidateKey.length - key.length);
      if (!bestPrefix || score < bestPrefix.score) {
        bestPrefix = { codigo: entry.codigo, score };
      }
    }
  }
  if (bestPrefix && bestPrefix.score <= Math.max(4, key.length * 0.4)) {
    return materiaByCodigo.get(bestPrefix.codigo) ?? null;
  }

  const maxDistance = Math.max(2, Math.floor(key.length * 0.15));
  let bestFuzzy: { codigo: string; distance: number } | null = null;
  for (const [candidateKey, entry] of searchIndex) {
    const d = levenshtein(key, candidateKey);
    if (d <= maxDistance && (!bestFuzzy || d < bestFuzzy.distance)) {
      bestFuzzy = { codigo: entry.codigo, distance: d };
    }
  }
  if (bestFuzzy) return materiaByCodigo.get(bestFuzzy.codigo) ?? null;

  return null;
}

export function findMateriaByCodigo(codigo: string | null | undefined): MateriaPlan | null {
  if (!codigo) return null;
  const key = normalize(codigo);
  const entry = searchIndex.get(key);
  if (!entry) return null;
  return materiaByCodigo.get(entry.codigo) ?? null;
}

/**
 * Formatea el semestre humano-legible según el campo del JSON.
 * 0 = Anual, 1 = 1° Semestre, 2 = 2° Semestre.
 */
export function semestreLabel(semestre: number, tipoDictado?: string): string {
  if (semestre === 0 || tipoDictado === "Anual") return "Anual";
  if (semestre === 1) return "1° Semestre";
  if (semestre === 2) return "2° Semestre";
  return `${semestre}° Semestre`;
}

/**
 * Formatea las correlativas de una materia como texto legible.
 * Ejemplo: "Regularizadas: LENG II, SIST I · Aprobadas: LENG I"
 */
export function formatCorrelativas(m: MateriaPlan): string {
  const partes: string[] = [];

  const reg = m.correlativasCursar.regularizadas
    .map((c) => materiaByCodigo.get(c)?.abreviatura ?? c)
    .filter(Boolean);
  const apr = m.correlativasCursar.aprobadas
    .map((c) => materiaByCodigo.get(c)?.abreviatura ?? c)
    .filter(Boolean);

  if (reg.length) partes.push(`Reg: ${reg.join(", ")}`);
  if (apr.length) partes.push(`Aprob: ${apr.join(", ")}`);

  return partes.join(" · ");
}

/**
 * Devuelve los nombres completos de las correlativas (para mostrar en UI detallada).
 */
export function correlativasDetalle(m: MateriaPlan): {
  regularizadas: MateriaPlan[];
  aprobadas: MateriaPlan[];
  paraRendir: MateriaPlan[];
} {
  return {
    regularizadas: m.correlativasCursar.regularizadas
      .map((c) => materiaByCodigo.get(c))
      .filter((x): x is MateriaPlan => Boolean(x)),
    aprobadas: m.correlativasCursar.aprobadas
      .map((c) => materiaByCodigo.get(c))
      .filter((x): x is MateriaPlan => Boolean(x)),
    paraRendir: m.correlativasRendir
      .map((c) => materiaByCodigo.get(c))
      .filter((x): x is MateriaPlan => Boolean(x)),
  };
}

/**
 * Info compacta para autocompletar formularios a partir del nombre de la materia.
 * Devuelve null si no encuentra una materia del plan.
 */
export type MateriaAutoInfo = {
  codigo: string;
  nombreOficial: string;
  anio: number;
  semestre: number;
  semestreLabel: string;
  cuatrimestre: number | null;
  correlativas: string;
  matchType: "codigo" | "nombre" | "abreviatura" | "alias" | "fuzzy";
};

export function autoInfoFromName(input: string | null | undefined): MateriaAutoInfo | null {
  const materia = findMateriaByName(input);
  if (!materia) return null;

  const normalized = normalize(input ?? "");
  const indexHit = searchIndex.get(normalized);

  return {
    codigo: materia.codigo,
    nombreOficial: materia.nombre,
    anio: materia.anio,
    semestre: materia.semestre,
    semestreLabel: semestreLabel(materia.semestre, materia.tipoDictado),
    cuatrimestre: materia.semestre === 0 ? null : materia.semestre,
    correlativas: formatCorrelativas(materia),
    matchType: indexHit?.source ?? "fuzzy",
  };
}

export function listMaterias(): MateriaPlan[] {
  return planEstudio.materias;
}
