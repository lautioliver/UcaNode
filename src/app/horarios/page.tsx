import { createHorario } from "@/lib/actions";
import { AppHeader, SectionCard } from "@/components/layout";
import {
  diaSemanaLabel,
  modalidadLabel,
} from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { DiaSemana, Modalidad } from "@/generated/prisma/client";

export default async function HorariosPage() {
  const [horarios, materias, perfil] = await Promise.all([
    prisma.horario.findMany({
      include: { materia: true },
      orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
    prisma.perfil.findFirst(),
  ]);

  const byDay = Object.values(DiaSemana).map((dia) => ({
    dia,
    items: horarios.filter((h) => h.dia === dia),
  }));

  return (
    <main className="space-y-6">
      <AppHeader perfilNombre={perfil?.nombre} />

      <div>
        <h1 className="text-2xl font-semibold">Horarios</h1>
        <p className="text-sm text-zinc-500">
          Horario personalizado según tus materias (botón 1 del dashboard).
        </p>
      </div>

      <SectionCard title="Nuevo horario">
        <form action={createHorario} className="grid gap-3 sm:grid-cols-2">
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
            name="dia"
            required
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(diaSemanaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="horaInicio"
            required
            placeholder="Hora inicio (18:00)"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="horaFin"
            required
            placeholder="Hora fin (22:00)"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <select
            name="modalidad"
            defaultValue={Modalidad.PRESENCIAL}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          >
            {Object.entries(modalidadLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="aulaLink"
            placeholder="Aula o link virtual"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 sm:col-span-2"
          >
            Agregar horario
          </button>
        </form>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {byDay.map(({ dia, items }) => (
          <SectionCard key={dia} title={diaSemanaLabel[dia]}>
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2"
                  >
                    <p className="text-sm font-medium">{h.materia.nombre}</p>
                    <p className="text-xs text-zinc-500">
                      {h.horaInicio} – {h.horaFin} · {modalidadLabel[h.modalidad]}
                    </p>
                    {h.aulaLink && (
                      <p className="mt-1 text-xs text-emerald-400">{h.aulaLink}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Sin clases.</p>
            )}
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
