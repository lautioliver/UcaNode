import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EntregaNotionPage,
  type EntregaNotionData,
} from "@/components/entrega-notion-page";
import { formatEntregaPageTitle } from "@/lib/entrega-display";
import { getOrCreatePerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const perfil = await getOrCreatePerfil();
  const entrega = await prisma.entrega.findFirst({
    where: { id, materia: { perfilId: perfil.id } },
    include: { materia: true },
  });

  if (!entrega) {
    return { title: "Entrega — UcaNode" };
  }

  return {
    title: `${formatEntregaPageTitle(entrega.titulo, entrega.materia)} — UcaNode`,
  };
}

export default async function EntregaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await getOrCreatePerfil();

  const [entrega, materias] = await Promise.all([
    prisma.entrega.findFirst({
      where: { id, materia: { perfilId: perfil.id } },
      include: { materia: true },
    }),
    prisma.materia.findMany({
      where: { perfilId: perfil.id },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
  ]);

  if (!entrega) notFound();

  const entregaData: EntregaNotionData = {
    id: entrega.id,
    titulo: entrega.titulo,
    tipo: entrega.tipo,
    fecha: entrega.fecha.toISOString(),
    estado: entrega.estado,
    nota: entrega.nota,
    materiaId: entrega.materiaId,
    recurso: entrega.recurso,
    prioridad: entrega.prioridad,
    fechaInicio: entrega.fechaInicio?.toISOString() ?? null,
    fechaCompletada: entrega.fechaCompletada?.toISOString() ?? null,
    materia: {
      id: entrega.materia.id,
      nombre: entrega.materia.nombre,
      codigo: entrega.materia.codigo,
      profesor: entrega.materia.profesor,
    },
  };

  return <EntregaNotionPage entrega={entregaData} materias={materias} />;
}
