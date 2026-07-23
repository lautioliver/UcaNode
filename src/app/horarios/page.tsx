import type { Metadata } from "next";
import { getOrCreatePerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";
import { CounterChip, PageHeader } from "@/components/layout";
import { HorariosWorkspace } from "@/components/horarios-workspace";
import { DiaSemana, EstadoMateria } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Horarios — UcaNode",
};

const ESTADOS_ACTIVOS = [EstadoMateria.CURSANDO, EstadoMateria.PARA_FINALIZAR] as const;

const currentDia = (): DiaSemana | null => {
  const idx = new Date().getDay();
  const map: Record<number, DiaSemana | null> = {
    0: null,
    1: DiaSemana.LUNES,
    2: DiaSemana.MARTES,
    3: DiaSemana.MIERCOLES,
    4: DiaSemana.JUEVES,
    5: DiaSemana.VIERNES,
    6: null,
  };
  return map[idx];
};

export default async function HorariosPage() {
  const perfil = await getOrCreatePerfil();

  const [horarios, materias] = await Promise.all([
    prisma.horario.findMany({
      where: {
        materia: { perfilId: perfil.id, estado: { in: [...ESTADOS_ACTIVOS] } },
      },
      include: { materia: true },
      orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
    }),
    prisma.materia.findMany({
      where: { perfilId: perfil.id, estado: { in: [...ESTADOS_ACTIVOS] } },
      orderBy: { nombre: "asc" },
    }),
  ]);

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));
  const hoy = currentDia();

  const horariosData = horarios.map((h) => ({
    id: h.id,
    dia: h.dia,
    horaInicio: h.horaInicio,
    horaFin: h.horaFin,
    modalidad: h.modalidad,
    aulaLink: h.aulaLink,
    materiaId: h.materiaId,
    materia: {
      id: h.materia.id,
      nombre: h.materia.nombre,
    },
  }));

  const totalPresencial = horarios.filter((h) => h.modalidad === "PRESENCIAL").length;
  const totalVirtual = horarios.filter((h) => h.modalidad === "VIRTUAL").length;

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Tu semana en un vistazo"
        title="Horarios"
        description="Visualizá y editá tu grilla semanal de clases presenciales y virtuales."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="accent" count={horarios.length} label="Clases totales" />
        <CounterChip tone="success" count={totalPresencial} label="Presenciales" />
        <CounterChip tone="accent" count={totalVirtual} label="Virtuales" />
      </div>

      <HorariosWorkspace
        horarios={horariosData}
        materias={materiasList}
        hoy={hoy}
      />
    </main>
  );
}
