import { ClipboardList, FileText, GraduationCap } from "lucide-react";
import type { ComponentType } from "react";
import type {
  EstadoEntrega,
  TipoEntrega,
} from "@/generated/prisma/client";
import { ProgressBar, StatusBadge } from "@/components/layout";
import { estadoEntregaLabel, tipoEntregaLabel } from "@/lib/labels";
import {
  daysUntil,
  humanDays,
  progressToDeadline,
  urgenciaFromDays,
  urgenciaLabel,
  urgenciaTone,
} from "@/lib/entrega-utils";

const tipoIcon: Record<TipoEntrega, ComponentType<{ className?: string }>> = {
  TP: ClipboardList,
  PARCIAL: FileText,
  FINAL: GraduationCap,
};

export type EntregaLite = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: Date;
  estado: EstadoEntrega;
  materia: { nombre: string; profesor?: string | null };
};

export function EntregaCard({ entrega }: { entrega: EntregaLite }) {
  const days = daysUntil(entrega.fecha);
  const urgencia = urgenciaFromDays(days);
  const tone = urgenciaTone[urgencia];
  const Icon = tipoIcon[entrega.tipo];
  const progress = progressToDeadline(days);
  const entregado = entrega.estado === "ENTREGADO";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] transition hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary">
              {entrega.titulo}
            </p>
            <p className="truncate text-xs text-muted">
              {entrega.materia.nombre}
              {entrega.materia.profesor
                ? ` · ${entrega.materia.profesor}`
                : ""}
            </p>
          </div>
        </div>
        <StatusBadge tone={entregado ? "success" : tone}>
          {entregado ? "Entregado" : urgenciaLabel[urgencia]}
        </StatusBadge>
      </div>

      <ProgressBar
        value={entregado ? 100 : progress}
        tone={entregado ? "success" : tone}
        label={entregado ? "Completada" : humanDays(days)}
      />

      <div className="flex items-center justify-between text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              entrega.estado === "ENTREGADO"
                ? "bg-success"
                : entrega.estado === "EN_CURSO"
                  ? "bg-warning"
                  : "bg-muted"
            }`}
          />
          {estadoEntregaLabel[entrega.estado]}
        </span>
        <span>{tipoEntregaLabel[entrega.tipo]}</span>
      </div>
    </article>
  );
}
