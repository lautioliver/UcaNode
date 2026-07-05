import type { Metadata } from "next";
import { EstadoMateria } from "@/generated/prisma/client";
import { CalendarioMes } from "@/components/calendario";
import {
  AppHeader,
  CalendarSectionTitle,
  EmptyState,
  LinkButton,
  SectionCard,
} from "@/components/layout";
import { MateriaList } from "@/components/materia-card";
import { estadoMateriaLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard — UcaNode",
};

export default async function DashboardPage() {
  const [perfil, cursando, otrasMaterias, entregas] = await Promise.all([
    prisma.perfil.findFirst(),
    prisma.materia.findMany({
      where: { estado: EstadoMateria.CURSANDO },
      orderBy: { nombre: "asc" },
    }),
    prisma.materia.findMany({
      where: {
        estado: {
          in: [
            EstadoMateria.PARA_FINALIZAR,
            EstadoMateria.REGULAR,
            EstadoMateria.FINALIZADA,
          ],
        },
      },
      orderBy: [{ estado: "asc" }, { nombre: "asc" }],
    }),
    prisma.entrega.findMany({
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
  ]);

  const grouped = Object.values(EstadoMateria)
    .filter((e) => e !== EstadoMateria.CURSANDO)
    .map((estado) => ({
      estado,
      materias: otrasMaterias.filter((m) => m.estado === estado),
    }))
    .filter((g) => g.materias.length > 0);

  return (
    <main className="space-y-6">
      <AppHeader perfilNombre={perfil?.nombre} />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Materias Cursando"
          action={<LinkButton href="/materias">Ver todas</LinkButton>}
        >
          {cursando.length > 0 ? (
            <MateriaList materias={cursando} />
          ) : (
            <EmptyState message="No tenés materias en curso. Agregá una desde Materias." />
          )}
        </SectionCard>

        <SectionCard
          title="Materias p/Finalizar · Regular · Finalizadas"
          action={<LinkButton href="/materias">Gestionar</LinkButton>}
        >
          {grouped.length > 0 ? (
            <div className="space-y-4">
              {grouped.map(({ estado, materias }) => (
                <div key={estado}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    {estadoMateriaLabel[estado]}
                  </p>
                  <MateriaList materias={materias} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Acá verás materias para finalizar, regularizadas y finalizadas." />
          )}
        </SectionCard>
      </div>

      <section className="rounded-xl border border-border bg-surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <CalendarSectionTitle />
          <LinkButton href="/entregas">+ Entregas</LinkButton>
        </div>
        <CalendarioMes entregas={entregas} />
      </section>
    </main>
  );
}
