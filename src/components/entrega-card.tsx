"use client";

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
  fecha: Date | string;
  estado: EstadoEntrega;
  nota?: number | null;
  materia: { nombre: string; codigo?: string | null; profesor?: string | null };
};

type EntregaCardProps = {
  entrega: EntregaLite;
  interactive?: boolean;
  onOpen?: () => void;
};

export function EntregaCard({
  entrega,
  interactive = false,
  onOpen,
}: EntregaCardProps) {
  const fecha = typeof entrega.fecha === "string" ? new Date(entrega.fecha) : entrega.fecha;
  const days = daysUntil(fecha);
  const urgencia = urgenciaFromDays(days);
  const tone = urgenciaTone[urgencia];
  const Icon = tipoIcon[entrega.tipo];
  const progress = progressToDeadline(days);
  const entregado = entrega.estado === "ENTREGADO";

  return (
    <article
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onOpen : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen?.();
              }
            }
          : undefined
      }
      className={`flex min-w-0 w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)] transition sm:p-5 ${
        entregado ? "opacity-55 saturate-75" : ""
      } ${
        interactive
          ? "cursor-pointer hover:border-border-strong hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          : "hover:border-border-strong"
      }`}
    >
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-primary">
              {entrega.materia.codigo && (
                <span className="max-w-[5.5rem] shrink-0 truncate rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary">
                  {entrega.materia.codigo}
                </span>
              )}
              <span className="min-w-0 truncate">{entrega.titulo}</span>
            </p>
            <p className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
              {entrega.materia.nombre}
              {entrega.materia.profesor ? ` · ${entrega.materia.profesor}` : ""}
            </p>
          </div>
        </div>
        <StatusBadge tone={entregado ? "success" : tone} className="shrink-0">
          {entregado ? "Entregado" : urgenciaLabel[urgencia]}
        </StatusBadge>
      </div>

      <ProgressBar
        value={entregado ? 100 : progress}
        tone={entregado ? "success" : tone}
        label={entregado ? "Completada" : humanDays(days)}
      />

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
        <span className="inline-flex min-w-0 items-center gap-1.5">
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
        <span className="inline-flex shrink-0 flex-wrap items-center justify-end gap-2">
          {entrega.tipo === "PARCIAL" && entrega.nota != null && (
            <span className="rounded-full bg-accent-ghost px-2 py-0.5 font-semibold text-accent">
              Nota: {entrega.nota}
            </span>
          )}
          <span>{tipoEntregaLabel[entrega.tipo]}</span>
        </span>
      </div>
    </article>
  );
}
