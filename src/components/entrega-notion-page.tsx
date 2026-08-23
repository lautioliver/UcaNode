"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Clock,
  ExternalLink,
  FileDown,
  FileText,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Sparkles,
  Tag,
} from "lucide-react";
import type { ComponentType } from "react";
import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import { Drawer } from "@/components/drawer";
import { EntregaEditForm } from "@/components/forms";
import {
  EntregaNotasPanel,
  type EntregaNotasPanelHandle,
  type NotasSaveStatus,
} from "@/components/entrega-notas-panel";
import { ProgressBar } from "@/components/layout";
import { deleteEntrega, updateEntrega } from "@/lib/actions";
import { exportEntregaNotasPdf } from "@/lib/entrega-notas-export";
import {
  formatEntregaFechaLarga,
  formatEntregaHora,
  formatEntregaPageTitle,
  estadoEntregaNotionClass,
  tipoEntregaNotionClass,
  tipoEntregaTileClass,
} from "@/lib/entrega-display";
import {
  daysUntil,
  humanDays,
  progressToDeadline,
  urgenciaFromDays,
  urgenciaLabel,
  urgenciaTone,
  type UrgenciaTone,
} from "@/lib/entrega-utils";
import { estadoEntregaLabel, tipoEntregaLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EntregaNotionData = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: string;
  estado: EstadoEntrega;
  nota: number | null;
  materiaId: string;
  recurso: string | null;
  prioridad: string | null;
  fechaInicio: string | null;
  fechaCompletada: string | null;
  materia: {
    id: string;
    nombre: string;
    codigo: string | null;
    profesor: string | null;
  };
};

const tipoIcon: Record<TipoEntrega, ComponentType<{ className?: string }>> = {
  TP: ClipboardList,
  PARCIAL: FileText,
  FINAL: GraduationCap,
};

const toneTileClass: Record<UrgenciaTone | "neutral", string> = {
  danger: "bg-danger-ghost text-danger",
  warning: "bg-warning-ghost text-warning",
  success: "bg-success-ghost text-success",
  neutral: "bg-surface-hover text-secondary",
};

const toneTextClass: Record<UrgenciaTone | "neutral", string> = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
  neutral: "text-secondary",
};

type PropertyRowProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
};

function PropertyRow({ icon, label, children }: PropertyRowProps) {
  return (
    <div className="grid grid-cols-[124px_minmax(0,1fr)] items-center gap-x-4 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-hover/60 sm:grid-cols-[168px_minmax(0,1fr)]">
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-80">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="min-w-0 text-sm text-primary">{children}</div>
    </div>
  );
}

function NotionPill({
  className,
  dot,
  children,
}: {
  className: string;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-90" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

function SaveStatusPill({ status }: { status: NotasSaveStatus }) {
  if (status === "idle") return null;

  const config = {
    saving: {
      label: "Guardando…",
      className: "border-border bg-surface-card text-muted",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    saved: {
      label: "Guardado",
      className: "border-[color:var(--success)]/30 bg-success-ghost text-success",
      icon: <Check className="h-3 w-3" />,
    },
    dirty: {
      label: "Sin guardar",
      className: "border-border bg-surface-card text-muted",
      icon: <span className="h-1.5 w-1.5 rounded-full bg-current" />,
    },
    error: {
      label: "Error al guardar",
      className: "border-[color:var(--danger)]/30 bg-danger-ghost text-danger",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  }[status];

  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        config.className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

export function EntregaNotionPage({
  entrega,
  materias,
}: {
  entrega: EntregaNotionData;
  materias: { id: string; nombre: string }[];
}) {
  const router = useRouter();
  const notasPanelRef = useRef<EntregaNotasPanelHandle>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [notasStatus, setNotasStatus] = useState<NotasSaveStatus>("idle");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const pageTitle = formatEntregaPageTitle(entrega.titulo, entrega.materia);
  const materiaLabel = entrega.materia.codigo
    ? `${entrega.materia.codigo} | ${entrega.materia.nombre}`
    : entrega.materia.nombre;

  const TipoIcon = tipoIcon[entrega.tipo];
  const entregado = entrega.estado === "ENTREGADO";
  const dias = daysUntil(new Date(entrega.fecha));
  const urgencia = urgenciaFromDays(dias);
  const deadlineTone: UrgenciaTone | "neutral" = entregado
    ? "success"
    : urgenciaTone[urgencia];
  const deadlineLabel = entregado ? "Entrega completada" : humanDays(dias);
  const deadlineProgress = entregado ? 100 : progressToDeadline(dias);

  const extraProperties = useMemo(() => {
    const rows: { label: string; value: React.ReactNode }[] = [];
    if (entrega.prioridad) {
      rows.push({ label: "Prioridad", value: entrega.prioridad });
    }
    if (entrega.nota != null && entrega.tipo !== "TP") {
      rows.push({ label: "Nota", value: entrega.nota });
    }
    if (entrega.recurso) {
      rows.push({
        label: "Enlace",
        value: (
          <a
            href={entrega.recurso}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 truncate text-accent hover:underline"
          >
            {entrega.recurso.replace(/^https?:\/\//, "")}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ),
      });
    }
    if (entrega.materia.profesor) {
      rows.push({ label: "Profesor", value: entrega.materia.profesor });
    }
    if (entrega.fechaInicio) {
      rows.push({
        label: "Inicio",
        value: formatEntregaFechaLarga(entrega.fechaInicio),
      });
    }
    if (entrega.fechaCompletada) {
      rows.push({
        label: "Completada",
        value: formatEntregaFechaLarga(entrega.fechaCompletada),
      });
    }
    return rows;
  }, [entrega]);

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${entrega.titulo}"?`)) return;
    const fd = new FormData();
    fd.set("id", entrega.id);
    await deleteEntrega({ success: true }, fd);
    router.push("/entregas");
    router.refresh();
  }

  async function handleExportPdf() {
    setExportError(null);
    setExportingPdf(true);
    try {
      const doc = notasPanelRef.current?.getContent() ?? null;
      await exportEntregaNotasPdf(doc, {
        title: pageTitle,
        materia: materiaLabel,
        fechaEntrega: `${formatEntregaFechaLarga(entrega.fecha)} · ${formatEntregaHora(entrega.fecha)}`,
        tipo: tipoEntregaLabel[entrega.tipo],
        estado: estadoEntregaLabel[entrega.estado],
      });
    } catch {
      setExportError("No se pudo generar el PDF. Intentá de nuevo.");
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <>
      <div className="entrega-notion-page pb-16">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/entregas"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1.5 text-xs font-medium text-secondary shadow-[var(--shadow-card)] transition hover:border-border-strong hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Entregas
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <SaveStatusPill status={notasStatus} />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => void handleExportPdf()}
                  disabled={exportingPdf}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-surface-card/60 py-1.5 pl-3 pr-1.5 text-xs font-medium text-muted opacity-70 transition hover:border-border-strong hover:text-secondary hover:opacity-100 disabled:cursor-wait"
                >
                  {exportingPdf ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileDown className="h-3.5 w-3.5" />
                  )}
                  Exportar PDF
                  <span className="ml-0.5 inline-flex items-center gap-1 rounded-full bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    <Sparkles className="h-2.5 w-2.5" />
                    Beta
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[220px] text-center">
                La exportación a PDF está en desarrollo. Podés probarla, pero el
                formato puede cambiar.
              </TooltipContent>
            </Tooltip>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1.5 text-xs font-medium text-secondary shadow-[var(--shadow-card)] transition hover:border-border-strong hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              Ver detalles
            </button>
          </div>
        </div>

        <header className="space-y-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12",
                tipoEntregaTileClass[entrega.tipo],
              )}
            >
              <TipoIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <h1
                className={cn(
                  "text-[1.75rem] font-bold leading-tight tracking-tight text-primary sm:text-[2.15rem]",
                  entregado && "line-through decoration-2 opacity-70",
                )}
              >
                {pageTitle}
              </h1>
              <p className="truncate text-sm text-secondary">
                {materiaLabel}
                {entrega.materia.profesor ? ` · ${entrega.materia.profesor}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NotionPill className={tipoEntregaNotionClass[entrega.tipo]}>
              {tipoEntregaLabel[entrega.tipo]}
            </NotionPill>
            <NotionPill
              className={estadoEntregaNotionClass[entrega.estado]}
              dot={entrega.estado !== "PENDIENTE"}
            >
              {estadoEntregaLabel[entrega.estado]}
            </NotionPill>
            {!entregado && (
              <NotionPill
                className={cn(
                  "border-[color:var(--border)]",
                  toneTileClass[deadlineTone],
                )}
                dot
              >
                {urgenciaLabel[urgencia]}
              </NotionPill>
            )}
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-surface-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border bg-surface-subtle px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    toneTileClass[deadlineTone],
                  )}
                >
                  <CalendarClock className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      toneTextClass[deadlineTone],
                    )}
                  >
                    {deadlineLabel}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {formatEntregaFechaLarga(entrega.fecha)} ·{" "}
                    {formatEntregaHora(entrega.fecha)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3.5">
              <ProgressBar
                value={deadlineProgress}
                tone={deadlineTone}
                showValue={false}
              />
            </div>
          </div>

          <div className="divide-y divide-border/50 p-2 sm:p-2.5">
            <PropertyRow icon={<BookOpen className="h-4 w-4" />} label="Materia">
              <Link
                href={`/materias/${entrega.materia.id}`}
                className="inline-flex max-w-full items-center gap-1 truncate font-medium transition hover:text-accent"
              >
                <span className="truncate">{materiaLabel}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </Link>
            </PropertyRow>
            <PropertyRow icon={<Tag className="h-4 w-4" />} label="Tipo">
              <NotionPill className={tipoEntregaNotionClass[entrega.tipo]}>
                {tipoEntregaLabel[entrega.tipo]}
              </NotionPill>
            </PropertyRow>
            <PropertyRow icon={<CircleDot className="h-4 w-4" />} label="Estado">
              <NotionPill
                className={estadoEntregaNotionClass[entrega.estado]}
                dot={entrega.estado !== "PENDIENTE"}
              >
                {estadoEntregaLabel[entrega.estado]}
              </NotionPill>
            </PropertyRow>
            <PropertyRow icon={<Clock className="h-4 w-4" />} label="Hora entrega">
              <span className="font-mono text-sm">
                {formatEntregaHora(entrega.fecha)}
              </span>
            </PropertyRow>

            {extraOpen &&
              extraProperties.map((row) => (
                <PropertyRow
                  key={row.label}
                  icon={<MoreHorizontal className="h-4 w-4" />}
                  label={row.label}
                >
                  {row.value}
                </PropertyRow>
              ))}
          </div>

          {extraProperties.length > 0 && (
            <button
              type="button"
              onClick={() => setExtraOpen((open) => !open)}
              className="flex w-full items-center gap-1.5 border-t border-border px-4 py-2.5 text-xs font-medium text-muted transition hover:bg-surface-hover hover:text-primary sm:px-5"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  extraOpen && "rotate-180",
                )}
              />
              {extraOpen
                ? "Ocultar propiedades"
                : `${extraProperties.length} propiedad${extraProperties.length === 1 ? "" : "es"} más`}
            </button>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-primary">Apuntes</h2>
            </div>
            <p className="text-xs text-muted">Se guardan automáticamente</p>
          </div>

          {exportError && (
            <p className="mb-3 rounded-xl border border-[color:var(--danger)]/30 bg-danger-ghost px-3 py-2 text-sm text-danger">
              {exportError}
            </p>
          )}

          <div className="rounded-2xl border border-border bg-surface-card px-5 py-4 shadow-[var(--shadow-card)] sm:px-7 sm:py-6">
            <EntregaNotasPanel
              ref={notasPanelRef}
              entregaId={entrega.id}
              variant="notion"
              onStatusChange={setNotasStatus}
            />
          </div>
        </section>
      </div>

      <Drawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        subtitle="Editar entrega"
        title={entrega.titulo}
      >
        <EntregaEditForm
          action={updateEntrega}
          materias={materias}
          compact
          onSuccess={() => {
            setEditOpen(false);
            router.refresh();
          }}
          onDelete={handleDelete}
          defaultValues={{
            id: entrega.id,
            titulo: entrega.titulo,
            tipo: entrega.tipo,
            fecha: entrega.fecha.slice(0, 10),
            estado: entrega.estado,
            nota: entrega.nota,
            materiaId: entrega.materiaId,
            recurso: entrega.recurso,
            prioridad: entrega.prioridad,
          }}
        />
      </Drawer>
    </>
  );
}
