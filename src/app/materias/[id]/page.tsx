import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/layout";
import { EntregaRow } from "@/components/calendario";
import { estadoMateriaLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

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
      <Link href="/materias" className="text-sm text-emerald-400 hover:underline">
        ← Volver a materias
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{materia.nombre}</h1>
        <p className="text-sm text-zinc-500">
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
            <p className="text-sm text-zinc-500">Sin entregas registradas.</p>
          )}
        </SectionCard>

        <SectionCard title="Horarios">
          {materia.horarios.length > 0 ? (
            <div className="space-y-2">
              {materia.horarios.map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm"
                >
                  <p className="font-medium">{h.dia}</p>
                  <p className="text-zinc-500">
                    {h.horaInicio} – {h.horaFin} · {h.modalidad}
                  </p>
                  {h.aulaLink && <p className="text-zinc-500">{h.aulaLink}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Sin horarios cargados.</p>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
