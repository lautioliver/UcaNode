import type { Metadata } from "next";
import { EstadoMateria } from "@/generated/prisma/client";
import { CounterChip, PageHeader } from "@/components/layout";
import { MateriaCatalog } from "@/components/materia-catalog";
import { prisma } from "@/lib/prisma";
import { createMateria, updateMateria, deleteMateria } from "@/lib/actions";
import { getPerfilConCarrera } from "@/lib/perfil";
import { getPlanMateriasByCarreraId } from "@/lib/planes-estudio/queries";

export const metadata: Metadata = {
  title: "Materias — UcaNode",
};

export default async function MateriasPage() {
  const perfil = await getPerfilConCarrera();
  if (!perfil) return null;

  const [materias, planMaterias] = await Promise.all([
    prisma.materia.findMany({
      where: { perfilId: perfil.id },
      orderBy: { nombre: "asc" },
    }),
    perfil?.carreraId ? getPlanMateriasByCarreraId(perfil.carreraId) : Promise.resolve([]),
  ]);

  const counts = {
    cursando: materias.filter((m) => m.estado === EstadoMateria.CURSANDO).length,
    porFinalizar: materias.filter((m) => m.estado === EstadoMateria.PARA_FINALIZAR)
      .length,
    regular: materias.filter((m) => m.estado === EstadoMateria.REGULAR).length,
    finalizada: materias.filter((m) => m.estado === EstadoMateria.FINALIZADA).length,
  };

  const json = materias.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    codigo: m.codigo,
    estado: m.estado,
    profesor: m.profesor,
    cuatrimestre: m.cuatrimestre,
    anio: m.anio,
    semestre: m.semestre,
    correlativas: m.correlativas,
    notas: m.notas,
    promocional: m.promocional,
    dia: m.dia,
  }));

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Tu plan de materias"
        title="¿Cómo van tus materias?"
        description="Galería de materias con abreviatura, nombre y período. Tocá una tarjeta para ver el detalle."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="accent" count={counts.cursando} label="Cursando" />
        <CounterChip tone="warning" count={counts.porFinalizar} label="Para finalizar" />
        <CounterChip tone="accent" count={counts.regular} label="Regular" />
        <CounterChip tone="success" count={counts.finalizada} label="Finalizadas" />
      </div>

      <MateriaCatalog
        materias={json}
        planMaterias={planMaterias}
        createMateria={createMateria}
        updateMateria={updateMateria}
        deleteMateria={deleteMateria}
      />
    </main>
  );
}
