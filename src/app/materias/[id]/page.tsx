import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/layout";
import { EntregaRow } from "@/components/calendario";
import { estadoMateriaLabel, diaSemanaLabel, modalidadLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Materia — UcaNode",
};

export default async function MateriaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const materia = await prisma.materia.findUnique({
    where: { id },
    include: {
      entregas: { orderBy: { fecha: "asc" } },
      horarios: true,
    },
  });

  if (!materia) notFound();

  return (
    <main className="space-y-6">
      <Link href="/materias" className="text-sm text-accent hover:text-accent-hover">
        ← Volver a materias
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-primary">{materia.nombre}</h1>
        <p className="text-sm text-muted">
          {[materia.codigo, estadoMateriaLabel[materia.estado], materia.profesor]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Entregas">
          {materia.entregas.length > 0 ? (
            <div className="space-y-2">
              {materia.entregas.map((e) => (
                <EntregaRow key={e.id} entrega={{ ...e, materia }} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sin entregas registradas.</p>
          )}
        </SectionCard>

        <SectionCard title="Horarios">
          {materia.horarios.length > 0 ? (
            <div className="space-y-2">
              {materia.horarios.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <p className="font-medium text-primary">{diaSemanaLabel[h.dia]}</p>
                  <p className="text-muted">
                    {h.horaInicio} – {h.horaFin} · {modalidadLabel[h.modalidad]}
                  </p>
                  {h.aulaLink && <p className="text-muted">{h.aulaLink}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sin horarios cargados.</p>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
