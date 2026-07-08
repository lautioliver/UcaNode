import type { Metadata } from "next";
import { Clock, MapPin, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  CounterChip,
  EmptyState,
  PageHeader,
  SectionCard,
} from "@/components/layout";
import { HorarioCreateForm, HorarioEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { createHorario, updateHorario, deleteHorario } from "@/lib/actions";
import { diaSemanaLabel, modalidadLabel } from "@/lib/labels";
import { DiaSemana } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Horarios — UcaNode",
};

const currentDia = (): DiaSemana | null => {
  const idx = new Date().getDay();
  const map: Record<number, DiaSemana | null> = {
    0: null,
    1: DiaSemana.LUNES,
    2: DiaSemana.MARTES,
    3: DiaSemana.MIERCOLES,
    4: DiaSemana.JUEVES,
    5: DiaSemana.VIERNES,
    6: null,
  };
  return map[idx];
};

export default async function HorariosPage() {
  const [horarios, materias] = await Promise.all([
    prisma.horario.findMany({
      include: { materia: true },
      orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
    }),
    prisma.materia.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const materiasList = materias.map((m) => ({ id: m.id, nombre: m.nombre }));
  const hoy = currentDia();

  const byDay = Object.values(DiaSemana).map((dia) => ({
    dia,
    items: horarios.filter((h) => h.dia === dia),
  }));

  const totalPresencial = horarios.filter((h) => h.modalidad === "PRESENCIAL").length;
  const totalVirtual = horarios.filter((h) => h.modalidad === "VIRTUAL").length;

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Tu semana en un vistazo"
        title="¿Qué clases tenés esta semana?"
        description="Un panorama por día con modalidad, aula y horario. El día actual se destaca."
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="accent" count={horarios.length} label="Clases totales" />
        <CounterChip tone="success" count={totalPresencial} label="Presenciales" />
        <CounterChip tone="accent" count={totalVirtual} label="Virtuales" />
      </div>

      <SectionCard title="Nuevo horario">
        <HorarioCreateForm action={createHorario} materias={materiasList} />
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {byDay.map(({ dia, items }) => {
          const esHoy = dia === hoy;
          return (
            <section
              key={dia}
              className={`flex flex-col rounded-2xl border bg-surface-card p-5 shadow-[var(--shadow-card)] ${
                esHoy ? "border-accent" : "border-border"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {diaSemanaLabel[dia]}
                  </p>
                  {esHoy && (
                    <p className="text-[10px] font-medium uppercase tracking-wider text-accent">
                      Hoy
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-muted">
                  {items.length} clase{items.length === 1 ? "" : "s"}
                </span>
              </div>

              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((h) => (
                    <ItemActions
                      key={h.id}
                      label={`${h.materia.nombre} (${diaSemanaLabel[h.dia]})`}
                      deleteAction={deleteHorario}
                      deleteId={h.id}
                      view={
                        <div className="rounded-xl border border-border bg-surface p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="min-w-0 truncate text-sm font-medium text-primary">
                              {h.materia.nombre}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                h.modalidad === "PRESENCIAL"
                                  ? "bg-success-ghost text-success"
                                  : "bg-accent-ghost text-accent"
                              }`}
                            >
                              {h.modalidad === "PRESENCIAL" ? (
                                <MapPin className="h-2.5 w-2.5" />
                              ) : (
                                <Video className="h-2.5 w-2.5" />
                              )}
                              {modalidadLabel[h.modalidad]}
                            </span>
                          </div>
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-secondary">
                            <Clock className="h-3 w-3" />
                            {h.horaInicio} – {h.horaFin}
                          </p>
                          {h.aulaLink && (
                            <p className="mt-1 truncate text-[11px] text-muted">
                              {h.aulaLink}
                            </p>
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
                <EmptyState message="Sin clases." />
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
