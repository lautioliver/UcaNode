import { createEntrega } from "@/lib/actions";
import { CalendarioMes, EntregaRow } from "@/components/calendario";
import { SectionCard } from "@/components/layout";
import {
  estadoEntregaLabel,
  tipoEntregaLabel,
} from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";

export default async function EntregasPage() {
  const [entregas, materias] = await Promise.all([
    prisma.entrega.findMany({
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Entregas</h1>
        <p className="text-sm text-zinc-500">
          TP, parciales y finales de todas tus materias.
        </p>
      </div>

      <SectionCard title="Nueva entrega">
        <form action={createEntrega} className="grid gap-3 sm:grid-cols-2">
          <input
            name="titulo"
            required
            placeholder="Título"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2"
          />
          <select
            name="materiaId"
            required
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="">Materia</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          <select
            name="tipo"
            required
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(tipoEntregaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="fecha"
            type="date"
            required
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            name="estado"
            defaultValue={EstadoEntrega.PENDIENTE}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(estadoEntregaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="recurso"
            placeholder="Link al enunciado (opcional)"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 sm:col-span-2"
          >
            Agregar entrega
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Vista calendario">
        <CalendarioMes entregas={entregas} />
      </SectionCard>

      <SectionCard title="Lista completa">
        <div className="space-y-2">
          {entregas.map((e) => (
            <EntregaRow key={e.id} entrega={e} />
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
