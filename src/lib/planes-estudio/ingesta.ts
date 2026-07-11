import { Prisma } from "@/generated/prisma/client";
import type { Carrera } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCarreraCatalogo } from "@/lib/planes-estudio/catalogo";
import { obtenerPlanDesdeFuente } from "@/lib/planes-estudio/fuente";
import type { CorrelativaInsert } from "@/lib/planes-estudio/types";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

function buildCorrelativas(
  materias: NonNullable<ReturnType<typeof obtenerPlanDesdeFuente>>["materias"],
): CorrelativaInsert[] {
  const rows: CorrelativaInsert[] = [];

  for (const materia of materias) {
    for (const codigo of materia.correlativasCursar.regularizadas) {
      rows.push({
        materiaCodigo: materia.codigo,
        requisitoCodigo: codigo,
        tipo: "REGULARIZADA",
      });
    }
    for (const codigo of materia.correlativasCursar.aprobadas) {
      rows.push({
        materiaCodigo: materia.codigo,
        requisitoCodigo: codigo,
        tipo: "APROBADA",
      });
    }
    for (const codigo of materia.correlativasRendir) {
      rows.push({
        materiaCodigo: materia.codigo,
        requisitoCodigo: codigo,
        tipo: "PARA_RENDIR",
      });
    }
  }

  return rows;
}

async function ingestarCarrera(slug: string): Promise<Carrera> {
  const catalogo = getCarreraCatalogo(slug);
  const fuente = obtenerPlanDesdeFuente(slug);

  if (!catalogo || !fuente) {
    throw new Error("Carrera no disponible para ingesta.");
  }

  return prisma.$transaction(async (tx) => {
    const carrera = await tx.carrera.upsert({
      where: { slug },
      create: {
        slug,
        nombre: catalogo.nombre,
        planAnio: catalogo.planAnio,
        resolucion: catalogo.resolucion,
        modalidad: catalogo.modalidad,
        duracionAnios: catalogo.duracionAnios,
        estadoIngesta: "PENDIENTE",
      },
      update: {},
    });

    const materiasExistentes = await tx.planEstudio.count({
      where: { carreraId: carrera.id },
    });

    if (materiasExistentes === 0) {
      for (const materia of fuente.materias) {
        await tx.planEstudio.create({
          data: {
            codigo: materia.codigo,
            codigoOficial: materia.codigoOficial,
            nombre: materia.nombre,
            abreviatura: materia.abreviatura,
            aliases: materia.aliases,
            anio: materia.anio,
            semestre: materia.semestre,
            tipoDictado: materia.tipoDictado,
            creditos: materia.creditos,
            carreraId: carrera.id,
          },
        });
      }

      const planRows = await tx.planEstudio.findMany({
        where: { carreraId: carrera.id },
        select: { id: true, codigo: true },
      });
      const idByCodigo = new Map(planRows.map((row) => [row.codigo, row.id]));

      for (const row of buildCorrelativas(fuente.materias)) {
        const materiaId = idByCodigo.get(row.materiaCodigo);
        const requisitoId = idByCodigo.get(row.requisitoCodigo);
        if (!materiaId || !requisitoId) continue;

        await tx.correlatividadPlan.create({
          data: {
            materiaId,
            requisitoId,
            tipo: row.tipo,
          },
        });
      }
    }

    return tx.carrera.update({
      where: { id: carrera.id },
      data: { estadoIngesta: "LISTO" },
    });
  });
}

export async function hydrateCarrera(slug: string): Promise<Carrera> {
  const existente = await prisma.carrera.findUnique({
    where: { slug },
    include: { _count: { select: { materias: true } } },
  });

  if (existente?.estadoIngesta === "LISTO" && existente._count.materias > 0) {
    return existente;
  }

  try {
    return await ingestarCarrera(slug);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const carrera = await prisma.carrera.findUnique({ where: { slug } });
      if (carrera) return carrera;
    }

    console.error("Error en ingesta lazy de carrera:", error);
    throw new Error("No se pudo inicializar el plan de estudios para esta carrera.");
  }
}
