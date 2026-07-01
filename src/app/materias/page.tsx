import { createMateria } from "@/lib/actions";
import {
  estadoMateriaLabel,
} from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { EstadoMateria } from "@/generated/prisma/client";
import { MateriaList } from "@/components/materia-card";
import { SectionCard } from "@/components/layout";

export default async function MateriasPage() {
  const materias = await prisma.materia.findMany({ orderBy: { nombre: "asc" } });

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Materias</h1>
        <p className="text-sm text-zinc-500">
          Tabla maestra de todas tus materias de la carrera.
        </p>
      </div>

      <SectionCard title="Nueva materia">
        <form action={createMateria} className="grid gap-3 sm:grid-cols-2">
          <input
            name="nombre"
            required
            placeholder="Nombre"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="codigo"
            placeholder="Código (INF-201)"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            name="estado"
            defaultValue={EstadoMateria.CURSANDO}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(estadoMateriaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="profesor"
            placeholder="Profesor"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 sm:col-span-2"
          >
            Agregar materia
          </button>
        </form>
      </SectionCard>

      <SectionCard title={`Todas (${materias.length})`}>
        <MateriaList materias={materias} />
      </SectionCard>
    </main>
  );
}
