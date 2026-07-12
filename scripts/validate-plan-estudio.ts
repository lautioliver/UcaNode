import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type CorrelativasCursar = {
  regularizadas: string[];
  aprobadas: string[];
};

type MateriaPlan = {
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

type PlanEstudio = {
  carrera: string;
  plan: string;
  resolucion: string;
  modalidad: string;
  duracionAnios: number;
  descripcion: string;
  materias: MateriaPlan[];
};

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function loadPlan(filePath: string): PlanEstudio {
  const abs = resolve(filePath);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(abs, "utf8"));
  } catch {
    fail(`No se pudo leer JSON: ${abs}`);
  }

  const plan = raw as PlanEstudio;
  if (!plan.carrera?.trim()) fail("Falta carrera");
  if (!plan.plan?.trim()) fail("Falta plan");
  if (!Array.isArray(plan.materias) || plan.materias.length === 0) {
    fail("materias debe ser un array no vacío");
  }

  return plan;
}

function validatePlan(plan: PlanEstudio, label: string) {
  const codigos = new Set<string>();
  const errors: string[] = [];

  for (const m of plan.materias) {
    if (!m.codigo?.trim()) errors.push("Materia sin codigo");
    if (!m.nombre?.trim()) errors.push(`Materia ${m.codigo}: sin nombre`);
    if (!m.abreviatura?.trim()) errors.push(`Materia ${m.codigo}: sin abreviatura`);
    if (!Array.isArray(m.aliases)) errors.push(`Materia ${m.codigo}: aliases inválido`);
    if (![0, 1, 2].includes(m.semestre)) {
      errors.push(`Materia ${m.codigo}: semestre debe ser 0, 1 o 2`);
    }
    if (codigos.has(m.codigo)) errors.push(`Código duplicado: ${m.codigo}`);
    codigos.add(m.codigo);

    if (!m.correlativasCursar) {
      errors.push(`Materia ${m.codigo}: falta correlativasCursar`);
    } else {
      if (!Array.isArray(m.correlativasCursar.regularizadas)) {
        errors.push(`Materia ${m.codigo}: regularizadas inválidas`);
      }
      if (!Array.isArray(m.correlativasCursar.aprobadas)) {
        errors.push(`Materia ${m.codigo}: aprobadas inválidas`);
      }
    }
    if (!Array.isArray(m.correlativasRendir)) {
      errors.push(`Materia ${m.codigo}: correlativasRendir inválidas`);
    }
  }

  for (const m of plan.materias) {
    const refs = [
      ...m.correlativasCursar.regularizadas.map((ref) => ({
        ref,
        tipo: "REGULARIZADA",
      })),
      ...m.correlativasCursar.aprobadas.map((ref) => ({
        ref,
        tipo: "APROBADA",
      })),
      ...m.correlativasRendir.map((ref) => ({ ref, tipo: "PARA_RENDIR" })),
    ];
    const seen = new Set<string>();
    for (const { ref, tipo } of refs) {
      const key = `${m.codigo}|${ref}|${tipo}`;
      if (seen.has(key)) {
        errors.push(`Materia ${m.codigo}: correlativa duplicada ${ref} (${tipo})`);
      }
      seen.add(key);
      if (!codigos.has(ref)) {
        errors.push(`Materia ${m.codigo}: correlativa inexistente ${ref}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`❌ ${label} — ${errors.length} error(es):`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log(
    `✅ ${label} — ${plan.materias.length} materias, plan ${plan.plan}, carrera "${plan.carrera}"`,
  );
}

const files = process.argv.slice(2);
if (files.length === 0) {
  fail("Uso: npx tsx scripts/validate-plan-estudio.ts <archivo.json> [...]");
}

for (const file of files) {
  validatePlan(loadPlan(file), file);
}
