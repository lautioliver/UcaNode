"use client";

import { Check, ClipboardList, FileText, GraduationCap } from "lucide-react";
import type { ComponentType, MouseEvent } from "react";
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
  onToggleComplete?: () => void;
  toggling?: boolean;
};

export function EntregaCard({
  entrega,
  interactive = false,
  onOpen,
  onToggleComplete,
  toggling = false,
}: EntregaCardProps) {
  const fecha = typeof entrega.fecha === "string" ? new Date(entrega.fecha) : entrega.fecha;
  const days = daysUntil(fecha);
  const urgencia = urgenciaFromDays(days);
  const tone = urgenciaTone[urgencia];
  const Icon = tipoIcon[entrega.tipo];
  const progress = progressToDeadline(days);
  const entregado = entrega.estado === "ENTREGADO";

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.();
  };

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
      className={`group/card relative flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] transition ${
        entregado ? "opacity-60" : ""
      } ${
        interactive
          ? "cursor-pointer hover:border-border-strong hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          : "hover:border-border-strong"
      }`}
    >
      {interactive && onToggleComplete && (
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggling}
          aria-label={entregado ? "Marcar como pendiente" : "Marcar como entregada"}
          title={entregado ? "Marcar como pendiente" : "Marcar como entregada"}
          className={`absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition ${
            entregado
              ? "border-success bg-success text-white opacity-100"
              : "border-border bg-surface-card text-muted opacity-0 group-hover/card:opacity-100 hover:border-success hover:text-success"
          } ${toggling ? "cursor-wait opacity-70" : ""}`}
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent ${
              entregado ? "opacity-70" : ""
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 pr-6">
            <p
              className={`flex min-w-0 items-center gap-1.5 text-sm font-semibold text-primary ${
                entregado ? "line-through decoration-muted" : ""
              }`}
            >
              {entrega.materia.codigo && (
                <span className="shrink-0 rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary">
                  {entrega.materia.codigo}
                </span>
              )}
              <span className="truncate">{entrega.titulo}</span>
            </p>
            <p className="truncate text-xs text-muted">
              {entrega.materia.nombre}
              {entrega.materia.profesor ? ` · ${entrega.materia.profesor}` : ""}
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
        <span className="inline-flex items-center gap-2">
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
