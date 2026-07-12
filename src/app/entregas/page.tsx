import type { Metadata } from "next";
import { getOrCreatePerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";
import { EntregasWorkspace } from "@/components/entregas-workspace";

export const metadata: Metadata = {
  title: "Entregas — UcaNode",
};

export default async function EntregasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}) {
  const { q, tipo } = await searchParams;
  const perfil = await getOrCreatePerfil();

  const [entregas, materias] = await Promise.all([
    prisma.entrega.findMany({
      where: { materia: { perfilId: perfil.id } },
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
    prisma.materia.findMany({
      where: { perfilId: perfil.id },
      orderBy: { nombre: "asc" },
    }),
  ]);

  const entregasData = entregas.map((e) => ({
    id: e.id,
    titulo: e.titulo,
    tipo: e.tipo,
    fecha: e.fecha.toISOString(),
    estado: e.estado,
    nota: e.nota,
    materiaId: e.materiaId,
    recurso: e.recurso,
    prioridad: e.prioridad,
    materia: {
      id: e.materia.id,
      nombre: e.materia.nombre,
      codigo: e.materia.codigo,
      profesor: e.materia.profesor,
    },
  }));

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));

  return (
    <EntregasWorkspace
      entregas={entregasData}
      materias={materiasList}
      initialQ={q ?? ""}
      initialTipo={tipo ?? ""}
    />
  );
}
