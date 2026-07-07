import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createMateria, updateMateria, deleteMateria } from "@/lib/actions";
import { MateriaGrid } from "@/components/materia-grid";

export const metadata: Metadata = {
  title: "Materias — UcaNode",
};

export default async function MateriasPage() {
  const materias = await prisma.materia.findMany({ orderBy: { nombre: "asc" } });

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
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Materias</h1>
        <p className="text-sm text-muted">
          Vista semanal de tus materias.
        </p>
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
