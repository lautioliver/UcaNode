import type { Metadata } from "next";
import { EstadoMateria } from "@/generated/prisma/client";
import { CommunityWorkspace } from "@/app/comunidad/components/community-workspace";
import { MOCK_POSTS } from "@/app/comunidad/components/mock-data";
import { getPerfilConCarrera } from "@/lib/perfil";
import { getPlanMateriasByCarreraId } from "@/lib/planes-estudio/queries";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Comunidad — UcaNode",
};

export default async function ComunidadPage() {
  const perfil = await getPerfilConCarrera();
  if (!perfil) return null;

  const [materiasCursando, planMaterias] = await Promise.all([
    prisma.materia.findMany({
      where: { perfilId: perfil.id, estado: EstadoMateria.CURSANDO },
      select: { nombre: true, codigo: true },
      orderBy: { nombre: "asc" },
    }),
    perfil.carreraId
      ? getPlanMateriasByCarreraId(perfil.carreraId)
      : Promise.resolve([]),
  ]);

  return (
    <CommunityWorkspace
      carreraNombre={perfil.carrera?.nombre ?? "UCASAL"}
      authorName={perfil.nombre}
      materiasCursando={materiasCursando}
      planMaterias={planMaterias}
      initialPosts={MOCK_POSTS}
    />
  );
}
