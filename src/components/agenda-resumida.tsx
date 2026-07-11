import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import { EmptyState, LinkButton, SectionCard } from "@/components/layout";
import { tipoEntregaLabel } from "@/lib/labels";
import { daysUntil, humanDays } from "@/lib/entrega-utils";

type EntregaItem = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: Date;
  estado: EstadoEntrega;
  materia: { nombre: string; codigo?: string | null };
};

export function AgendaResumida({
  entregas,
  limite = 4,
}: {
  entregas: EntregaItem[];
  limite?: number;
}) {
  const proximas = entregas
    .filter((e) => e.estado !== "ENTREGADO")
    .filter((e) => daysUntil(e.fecha) >= -3)
    .slice(0, limite);

  return (
    <SectionCard
      title="Agenda rápida"
      action={<LinkButton href="/entregas">Ver calendario</LinkButton>}
    >
      {proximas.length > 0 ? (
        <ul className="divide-y divide-border">
          {proximas.map((e) => {
            const days = daysUntil(e.fecha);
            return (
              <li key={e.id}>
                <Link
                  href="/entregas"
                  className="flex items-center justify-between gap-3 py-2.5 transition hover:bg-surface-hover/60 -mx-1 px-1 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-primary">
                      {e.materia.codigo && (
                        <span className="shrink-0 rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          {e.materia.codigo}
                        </span>
                      )}
                      <span className="truncate">{e.titulo}</span>
                    </p>
                    <p className="truncate text-xs text-slate-600 font-medium dark:text-slate-300">
                      {e.materia.nombre}
                      {" · "}
                      {format(e.fecha, "EEE d MMM", { locale: es })}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-[10px] font-medium text-accent">
                      {tipoEntregaLabel[e.tipo]}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300">
                      {humanDays(days)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState message="Sin entregas próximas en la agenda." />
      )}
    </SectionCard>
  );
}
