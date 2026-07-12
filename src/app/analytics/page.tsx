import type { Metadata } from "next";
import { AnalyticsWorkspace } from "@/components/analytics-workspace";
import { getOrCreatePerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Analíticas — UcaNode",
};

export default async function AnalyticsPage() {
  const perfil = await getOrCreatePerfil();

  const [entregas, materias] = await Promise.all([
    prisma.entrega.findMany({
      where: { materia: { perfilId: perfil.id } },
      include: {
        materia: {
          select: { id: true, nombre: true, cuatrimestre: true },
        },
      },
      orderBy: { fecha: "desc" },
    }),
    prisma.materia.findMany({
      where: { perfilId: perfil.id },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
  ]);

  const entregasData = entregas.map((e) => ({
    id: e.id,
    titulo: e.titulo,
    tipo: e.tipo,
    fecha: e.fecha.toISOString(),
    estado: e.estado,
    nota: e.nota,
    fechaInicio: e.fechaInicio?.toISOString() ?? null,
    fechaCompletada: e.fechaCompletada?.toISOString() ?? null,
    materia: {
      id: e.materia.id,
      nombre: e.materia.nombre,
      cuatrimestre: e.materia.cuatrimestre,
    },
  }));

  return (
    <AnalyticsWorkspace entregas={entregasData} materias={materias} />
  );
}
