import type { Metadata } from "next";
import { EstadoMateria } from "@/generated/prisma/client";
import { CounterChip, PageHeader } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { createMateria, updateMateria, deleteMateria } from "@/lib/actions";
import { MateriaGrid } from "@/components/materia-grid";

export const metadata: Metadata = {
  title: "Materias — UcaNode",
};

export default async function MateriasPage() {
  const materias = await prisma.materia.findMany({ orderBy: { nombre: "asc" } });

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
        pill="Tu semestre en curso"
        title="¿Cómo va tu semestre?"
        description="Organizá tus materias por día de la semana. Tocá una tarjeta para editar o entrar al detalle."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="accent" count={counts.cursando} label="Cursando" />
        <CounterChip tone="warning" count={counts.porFinalizar} label="Para finalizar" />
        <CounterChip tone="accent" count={counts.regular} label="Regular" />
        <CounterChip tone="success" count={counts.finalizada} label="Finalizadas" />
      </div>

      <MateriaGrid
        materias={json}
        createMateria={createMateria}
        updateMateria={updateMateria}
        deleteMateria={deleteMateria}
      />
    </main>
  );
}
