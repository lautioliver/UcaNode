"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, Minus, Plus } from "lucide-react";
import type { ZoneStatus } from "@/lib/campustatus/client";
import {
  EDIFICIOS_LISTA,
  MAPA_CAMPUS,
  type EdificioCampus,
  type PuntoCampus,
  getEdificio,
} from "@/lib/campus/edificios";
import { cn } from "@/lib/utils";

const ZOOMS = [1, 1.5, 2, 3] as const;

const statusDotClass: Record<ZoneStatus, string> = {
  Verde: "bg-success",
  Amarillo: "bg-warning",
  Rojo: "bg-danger",
};

export type OcupacionPunto = {
  puntoId: string;
  zona: string;
  status: ZoneStatus;
  occupancy: number;
};

type Seleccion =
  | { tipo: "edificio"; id: number }
  | { tipo: "punto"; id: string }
  | null;

export function CampusMap({
  activeEdificioId,
  aula,
  puntos = [],
  ocupaciones = [],
  className,
}: {
  /** Edificio a resaltar al abrir el mapa (por ejemplo, el de la próxima clase). */
  activeEdificioId?: number | null;
  /** Aula concreta de la clase, se muestra en la ficha del edificio activo. */
  aula?: string | null;
  /** Capa opcional de servicios y referencias del campus. */
  puntos?: PuntoCampus[];
  /** Ocupación de CampuStatus ya cruzada con los puntos del mapa. */
  ocupaciones?: OcupacionPunto[];
  className?: string;
}) {
  const seleccionInicial = (id: number | null | undefined): Seleccion =>
    getEdificio(id) ? { tipo: "edificio", id: id as number } : null;

  const [seleccion, setSeleccion] = useState<Seleccion>(() =>
    seleccionInicial(activeEdificioId),
  );
  const [edificioResaltado, setEdificioResaltado] = useState(activeEdificioId);
  const [zoom, setZoom] = useState<number>(1);

  // Reenfoca el mapa cuando el edificio a resaltar cambia sin desmontar el componente.
  if (activeEdificioId !== edificioResaltado) {
    setEdificioResaltado(activeEdificioId);
    setSeleccion(seleccionInicial(activeEdificioId));
  }

  const ocupacionPorPunto = useMemo(() => {
    const mapa = new Map<string, OcupacionPunto>();
    for (const ocupacion of ocupaciones) mapa.set(ocupacion.puntoId, ocupacion);
    return mapa;
  }, [ocupaciones]);

  const edificioSeleccionado =
    seleccion?.tipo === "edificio" ? getEdificio(seleccion.id) : null;
  const puntoSeleccionado =
    seleccion?.tipo === "punto"
      ? (puntos.find((p) => p.id === seleccion.id) ?? null)
      : null;

  const zoomIndex = ZOOMS.indexOf(zoom as (typeof ZOOMS)[number]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface-card shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="relative">
        <div
          className="relative w-full overflow-auto"
          style={{ aspectRatio: `${MAPA_CAMPUS.width} / ${MAPA_CAMPUS.height}` }}
        >
          <div className="relative" style={{ width: `${zoom * 100}%` }}>
            <Image
              src={MAPA_CAMPUS.src}
              width={MAPA_CAMPUS.width}
              height={MAPA_CAMPUS.height}
              alt={MAPA_CAMPUS.alt}
              sizes="(min-width: 1024px) 75vw, 100vw"
              loading="eager"
              className="h-auto w-full select-none"
            />

            {EDIFICIOS_LISTA.map((edificio) => (
              <Marcador
                key={`edificio-${edificio.id}`}
                x={edificio.x}
                y={edificio.y}
                etiqueta={`Edificio ${edificio.id} · ${edificio.nombre}`}
                activo={
                  seleccion?.tipo === "edificio" && seleccion.id === edificio.id
                }
                onSelect={() => setSeleccion({ tipo: "edificio", id: edificio.id })}
              />
            ))}

            {puntos.map((punto) => {
              const ocupacion = ocupacionPorPunto.get(punto.id);
              return (
                <Marcador
                  key={`punto-${punto.id}`}
                  x={punto.x}
                  y={punto.y}
                  etiqueta={
                    ocupacion
                      ? `${punto.nombre} · ${ocupacion.occupancy}% de ocupación`
                      : punto.nombre
                  }
                  activo={seleccion?.tipo === "punto" && seleccion.id === punto.id}
                  onSelect={() => setSeleccion({ tipo: "punto", id: punto.id })}
                  badge={
                    ocupacion ? (
                      <span
                        className={cn(
                          "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white",
                          statusDotClass[ocupacion.status],
                        )}
                      />
                    ) : null
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-border bg-surface-card/95 p-1 shadow-[var(--shadow-card)] backdrop-blur-sm">
          <ZoomButton
            label="Alejar"
            disabled={zoomIndex <= 0}
            onClick={() => setZoom(ZOOMS[Math.max(0, zoomIndex - 1)])}
          >
            <Minus className="h-3.5 w-3.5" />
          </ZoomButton>
          <span className="min-w-9 text-center text-[11px] font-medium text-secondary">
            {zoom}x
          </span>
          <ZoomButton
            label="Acercar"
            disabled={zoomIndex >= ZOOMS.length - 1}
            onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zoomIndex + 1)])}
          >
            <Plus className="h-3.5 w-3.5" />
          </ZoomButton>
        </div>
      </div>

      {edificioSeleccionado ? (
        <FichaEdificio edificio={edificioSeleccionado} aula={aula} />
      ) : puntoSeleccionado ? (
        <FichaPunto
          punto={puntoSeleccionado}
          ocupacion={ocupacionPorPunto.get(puntoSeleccionado.id)}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface/90 px-4 py-3">
          <p className="text-xs text-muted">
            Tocá un marcador del mapa para ver de qué edificio se trata.
          </p>
          <a
            href={MAPA_CAMPUS.fuente}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-muted transition hover:text-accent"
          >
            {MAPA_CAMPUS.atribucion}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

function Marcador({
  x,
  y,
  etiqueta,
  activo,
  onSelect,
  badge,
}: {
  x: number;
  y: number;
  etiqueta: string;
  activo: boolean;
  onSelect: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={etiqueta}
      aria-label={etiqueta}
      aria-pressed={activo}
      style={{ left: `${x}%`, top: `${y}%` }}
      className={cn(
        "group absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform",
        activo ? "z-20 scale-110" : "z-10 hover:scale-110",
      )}
    >
      {activo && (
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
      )}
      <span
        className={cn(
          "absolute inset-0 rounded-full transition-all",
          activo
            ? "ring-[3px] ring-accent"
            : "ring-0 ring-accent/70 group-hover:ring-2",
        )}
      />
      {badge}
      {activo && (
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 max-w-[45vw] -translate-x-1/2 truncate rounded-full border border-border bg-surface-card px-2 py-0.5 text-[10px] font-medium text-primary shadow-[var(--shadow-card)]">
          {etiqueta}
        </span>
      )}
    </button>
  );
}

function ZoomButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-secondary transition hover:bg-surface-hover hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function FichaEdificio({
  edificio,
  aula,
}: {
  edificio: EdificioCampus;
  aula?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
      <div className="min-w-0">
        <h4 className="truncate text-sm font-semibold text-primary">
          {edificio.nombre}
        </h4>
        <p className="truncate text-xs text-muted">
          {aula ? `Aula asignada: ${aula}` : edificio.unidadAcademica}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-accent-ghost px-2.5 py-1 text-xs font-medium text-accent">
        Edificio #{edificio.id}
      </span>
    </div>
  );
}

function FichaPunto({
  punto,
  ocupacion,
}: {
  punto: PuntoCampus;
  ocupacion?: OcupacionPunto;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
      <div className="min-w-0">
        <h4 className="truncate text-sm font-semibold text-primary">
          {punto.nombre}
        </h4>
        <p className="truncate text-xs text-muted">
          {ocupacion
            ? `${ocupacion.occupancy}% de ocupación según CampuStatus`
            : "Punto de referencia del campus"}
        </p>
      </div>
      {ocupacion && (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-card px-2.5 py-1 text-xs font-medium text-secondary">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", statusDotClass[ocupacion.status])}
          />
          {ocupacion.status}
        </span>
      )}
    </div>
  );
}
