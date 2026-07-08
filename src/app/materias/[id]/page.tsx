import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  Card,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/layout";
import { EntregaCard } from "@/components/entrega-card";
import {
  diaSemanaLabel,
  estadoMateriaLabel,
  estadoMateriaTone,
  modalidadLabel,
} from "@/lib/labels";

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

  const entregasEnriched = materia.entregas.map((e) => ({
    ...e,
    materia: { nombre: materia.nombre, profesor: materia.profesor },
  }));

  return (
    <main className="space-y-8">
      <Link
        href="/materias"
        className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a materias
      </Link>

      <PageHeader
        pill={materia.codigo ?? "Materia"}
        title={materia.nombre}
        description={
          [materia.profesor, materia.semestre, materia.cuatrimestre && `Cuatrimestre ${materia.cuatrimestre}`, materia.anio && `Año ${materia.anio}`]
            .filter(Boolean)
            .join(" · ") || undefined
        }
        action={
          <StatusBadge tone={estadoMateriaTone[materia.estado]}>
            {estadoMateriaLabel[materia.estado]}
          </StatusBadge>
        }
      />

      {(materia.correlativas || materia.notas) && (
        <Card className="space-y-3">
          {materia.correlativas && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Correlativas
              </p>
              <p className="mt-1 text-sm text-primary">{materia.correlativas}</p>
            </div>
          )}
          {materia.notas && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Notas
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-primary">
                {materia.notas}
              </p>
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Entregas">
          {entregasEnriched.length > 0 ? (
            <div className="space-y-3">
              {entregasEnriched.map((e) => (
                <EntregaCard key={e.id} entrega={e} />
              ))}
            </div>
          ) : (
            <EmptyState message="Sin entregas registradas para esta materia." />
          )}
        </SectionCard>

        <SectionCard title="Horarios">
          {materia.horarios.length > 0 ? (
            <div className="space-y-2">
              {materia.horarios.map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-primary">
                      {diaSemanaLabel[h.dia]}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        h.modalidad === "PRESENCIAL"
                          ? "bg-success-ghost text-success"
                          : "bg-accent-ghost text-accent"
                      }`}
                    >
                      {modalidadLabel[h.modalidad]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-secondary">
                    {h.horaInicio} – {h.horaFin}
                  </p>
                  {h.aulaLink && (
                    <p className="mt-0.5 text-[11px] text-muted">{h.aulaLink}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Sin horarios cargados." />
          )}
        </SectionCard>
      </div>
    </main>
  );
}
