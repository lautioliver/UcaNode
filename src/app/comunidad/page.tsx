import type { Metadata } from "next";
import { CommunityWorkspace } from "@/app/comunidad/components/community-workspace";
import {
  getCommunitySidebarData,
  getPosts,
} from "@/lib/community/queries";
import { getPerfilConCarrera } from "@/lib/perfil";
import { getPlanMateriasByCarreraId } from "@/lib/planes-estudio/queries";
import { prisma } from "@/lib/prisma";
import { EstadoMateria } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Comunidad — UcaNode",
};

export default async function ComunidadPage() {
  const perfil = await getPerfilConCarrera();
  if (!perfil) return null;

  const [materiasCursando, planMaterias, initialPosts, sidebarData] =
    await Promise.all([
      prisma.materia.findMany({
        where: { perfilId: perfil.id, estado: EstadoMateria.CURSANDO },
        select: { nombre: true, codigo: true },
        orderBy: { nombre: "asc" },
      }),
      perfil.carreraId
        ? getPlanMateriasByCarreraId(perfil.carreraId)
        : Promise.resolve([]),
      getPosts({ tab: "todo", perfilId: perfil.id }),
      getCommunitySidebarData(),
    ]);

  return (
    <CommunityWorkspace
      carreraNombre={perfil.carrera?.nombre ?? "UCASAL"}
      materiasCursando={materiasCursando}
      planMaterias={planMaterias}
      initialPosts={initialPosts}
      sidebarData={sidebarData}
    />
  );
}
