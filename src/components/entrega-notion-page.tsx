"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  CircleDot,
  Clock,
  ExternalLink,
  FileDown,
  List,
  Loader2,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import type { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import { Drawer } from "@/components/drawer";
import { EntregaEditForm } from "@/components/forms";
import {
  EntregaNotasPanel,
  type EntregaNotasPanelHandle,
  type NotasSaveStatus,
} from "@/components/entrega-notas-panel";
import { deleteEntrega, updateEntrega } from "@/lib/actions";
import { exportEntregaNotasPdf } from "@/lib/entrega-notas-export";
import {
  formatEntregaFechaLarga,
  formatEntregaHora,
  formatEntregaPageTitle,
  estadoEntregaNotionClass,
  tipoEntregaNotionClass,
} from "@/lib/entrega-display";
import { estadoEntregaLabel, tipoEntregaLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

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

type PropertyRowProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
};

function PropertyRow({ icon, label, children }: PropertyRowProps) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-1.5 sm:grid-cols-[160px_minmax(0,1fr)]">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-80">
          {icon}
        </span>
        <span>{label}</span>
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
        "inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-90" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

function saveStatusLabel(status: NotasSaveStatus) {
  switch (status) {
    case "saving":
      return "Guardando…";
    case "saved":
      return "Guardado";
    case "dirty":
      return "Sin guardar";
    case "error":
      return "Error al guardar";
    default:
      return null;
  }
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

  const statusText = saveStatusLabel(notasStatus);

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
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/entregas"
            className="text-sm text-muted transition hover:text-primary"
          >
            Entregas
          </Link>
          <div className="flex items-center gap-2">
            {statusText && (
              <p
                className={cn(
                  "text-xs",
                  notasStatus === "error"
                    ? "text-danger"
                    : notasStatus === "saved"
                      ? "text-success"
                      : "text-muted",
                )}
                aria-live="polite"
              >
                {statusText}
              </p>
            )}
            <button
              type="button"
              onClick={() => void handleExportPdf()}
              disabled={exportingPdf}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition hover:bg-surface-hover hover:text-primary disabled:opacity-60"
            >
              {exportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileDown className="h-3.5 w-3.5" />
              )}
              Exportar PDF
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition hover:bg-surface-hover hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </button>
          </div>
        </div>

        <header className="space-y-3">
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-primary sm:text-[2.35rem]">
            {pageTitle}
          </h1>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="text-sm text-muted transition hover:text-primary"
          >
            Ver detalles
          </button>
        </header>

        <section className="mt-8 space-y-0.5 border-b border-border pb-8">
          <PropertyRow icon={<Calendar className="h-4 w-4" />} label="Fecha entrega">
            {formatEntregaFechaLarga(entrega.fecha)}
          </PropertyRow>
          <PropertyRow icon={<ArrowUpRight className="h-4 w-4" />} label="Materia">
            <Link
              href={`/materias/${entrega.materia.id}`}
              className="inline-flex max-w-full items-center gap-1 truncate transition hover:text-accent"
            >
              {materiaLabel}
            </Link>
          </PropertyRow>
          <PropertyRow icon={<List className="h-4 w-4" />} label="Tipo">
            <NotionPill className={tipoEntregaNotionClass[entrega.tipo]}>
              {tipoEntregaLabel[entrega.tipo]}
            </NotionPill>
          </PropertyRow>
          <PropertyRow icon={<CircleDot className="h-4 w-4" />} label="Estado">
            <NotionPill
              className={estadoEntregaNotionClass[entrega.estado]}
              dot={entrega.estado === "EN_CURSO"}
            >
              {estadoEntregaLabel[entrega.estado]}
            </NotionPill>
          </PropertyRow>
          <PropertyRow icon={<Clock className="h-4 w-4" />} label="Hora entrega">
            {formatEntregaHora(entrega.fecha)}
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

          {extraProperties.length > 0 && (
            <button
              type="button"
              onClick={() => setExtraOpen((open) => !open)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-muted transition hover:bg-surface-hover hover:text-primary"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  extraOpen && "rotate-180",
                )}
              />
              {extraOpen
                ? "Menos propiedades"
                : `${extraProperties.length} propiedad${extraProperties.length === 1 ? "" : "es"} más`}
            </button>
          )}
        </section>

        <section className="mt-8">
          {exportError && (
            <p className="mb-2 text-sm text-danger">{exportError}</p>
          )}
          <EntregaNotasPanel
            ref={notasPanelRef}
            entregaId={entrega.id}
            variant="notion"
            onStatusChange={setNotasStatus}
          />
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
