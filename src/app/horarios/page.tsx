import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/layout";
import { HorarioCreateForm, HorarioEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createHorario, updateHorario, deleteHorario } from "@/lib/actions";
import { diaSemanaLabel, modalidadLabel } from "@/lib/labels";
import { DiaSemana } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Horarios — UcaNode",
};

export default async function HorariosPage() {
  const [horarios, materias, perfil] = await Promise.all([
    prisma.horario.findMany({
      include: { materia: true },
      orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
    prisma.perfil.findFirst(),
  ]);

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));

  const byDay = Object.values(DiaSemana).map((dia) => ({
    dia,
    items: horarios.filter((h) => h.dia === dia),
  }));

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-card px-5 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Horarios</h1>
          <p className="text-sm text-muted">
            Horario personalizado según tus materias.
          </p>
        </div>
        {perfil?.nombre && (
          <span className="text-sm text-secondary">{perfil.nombre}</span>
        )}
      </header>

      <SectionCard title="Nuevo horario">
        <HorarioCreateForm action={createHorario} materias={materiasList} />
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {byDay.map(({ dia, items }) => (
          <SectionCard key={dia} title={diaSemanaLabel[dia]}>
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((h) => (
                  <ItemActions
                    key={h.id}
                    label={`${h.materia.nombre} (${diaSemanaLabel[h.dia]})`}
                    deleteAction={deleteHorario}
                    deleteId={h.id}
                    view={
                      <div>
                        <p className="text-sm font-medium text-primary">{h.materia.nombre}</p>
                        <p className="text-xs text-muted">
                          {h.horaInicio} – {h.horaFin} · {modalidadLabel[h.modalidad]}
                        </p>
                        {h.aulaLink && (
                          <p className="mt-1 text-xs text-accent">{h.aulaLink}</p>
                        )}
                      </div>
                    }
                    editForm={
                      <HorarioEditForm
                        action={updateHorario}
                        materias={materiasList}
                        defaultValues={{
                          id: h.id,
                          dia: h.dia,
                          horaInicio: h.horaInicio,
                          horaFin: h.horaFin,
                          modalidad: h.modalidad,
                          aulaLink: h.aulaLink,
                          materiaId: h.materiaId,
                        }}
                      />
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Sin clases.</p>
            )}
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
