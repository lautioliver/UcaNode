import type { PlanEstudio, CorrelatividadPlan } from "@/generated/prisma/client";
import { getPerfilConCarrera } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";
import type {
  CorrelativasCursar,
  MateriaPlanFuente,
  PlanEstudioFuente,
} from "@/lib/planes-estudio/types";

type PlanEstudioConCorrelativas = PlanEstudio & {
  correlativas: (CorrelatividadPlan & { requisito: PlanEstudio })[];
};

function correlativasFromRows(
  rows: PlanEstudioConCorrelativas["correlativas"],
): { correlativasCursar: CorrelativasCursar; correlativasRendir: string[] } {
  const correlativasCursar: CorrelativasCursar = {
    regularizadas: [],
    aprobadas: [],
  };
  const correlativasRendir: string[] = [];

  for (const row of rows) {
    if (row.tipo === "REGULARIZADA") {
      correlativasCursar.regularizadas.push(row.requisito.codigo);
    } else if (row.tipo === "APROBADA") {
      correlativasCursar.aprobadas.push(row.requisito.codigo);
    } else if (row.tipo === "PARA_RENDIR") {
      correlativasRendir.push(row.requisito.codigo);
    }
  }

  return { correlativasCursar, correlativasRendir };
}

export function planEstudioRowToMateriaPlan(
  row: PlanEstudioConCorrelativas,
): MateriaPlanFuente {
  const { correlativasCursar, correlativasRendir } = correlativasFromRows(row.correlativas);

  return {
    codigo: row.codigo,
    codigoOficial: row.codigoOficial ?? row.codigo,
    nombre: row.nombre,
    abreviatura: row.abreviatura ?? "",
    aliases: Array.isArray(row.aliases) ? (row.aliases as string[]) : [],
    anio: row.anio,
    semestre: row.semestre,
    tipoDictado: row.tipoDictado ?? "",
    creditos: row.creditos ?? 0,
    correlativasCursar,
    correlativasRendir,
  };
}

export async function getPlanMateriasByCarreraId(
  carreraId: string,
): Promise<MateriaPlanFuente[]> {
  const rows = await prisma.planEstudio.findMany({
    where: { carreraId },
    include: {
      correlativas: {
        include: { requisito: true },
      },
    },
    orderBy: [{ anio: "asc" }, { semestre: "asc" }, { nombre: "asc" }],
  });

  return rows.map(planEstudioRowToMateriaPlan);
}

export async function getPlanEstudioForPerfil(): Promise<PlanEstudioFuente | null> {
  const perfil = await getPerfilConCarrera();

  if (!perfil?.carreraId || !perfil.carrera) return null;

  const materias = await getPlanMateriasByCarreraId(perfil.carreraId);

  return {
    carrera: perfil.carrera.nombre,
    plan: perfil.carrera.planAnio,
    resolucion: perfil.carrera.resolucion ?? "",
    modalidad: perfil.carrera.modalidad ?? "",
    duracionAnios: perfil.carrera.duracionAnios ?? 0,
    descripcion: "",
    materias,
  };
}
