"use client";

import { useState } from "react";
import { Clock, MapPin, Video } from "lucide-react";
import { CampusMap } from "@/components/campus-map";
import { StatusBadge } from "@/components/layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEdificio } from "@/lib/campus/edificios";
import { formatearEspera } from "@/lib/horario-utils";

export type ProximaClase = {
  materia: string;
  horaInicio: string;
  horaFin: string;
  modalidad: string;
  etiqueta: string | null;
  edificioId: number | null;
  aula: string | null;
  aulaLink: string | null;
  estado: "EN_CURSO" | "PROXIMA";
  minutos: number;
};

export function ProximaClaseCard({ clase }: { clase: ProximaClase }) {
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const edificio = getEdificio(clase.edificioId);
  const presencial = clase.modalidad === "PRESENCIAL";
  const enCurso = clase.estado === "EN_CURSO";

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            {enCurso ? "Clase en curso" : "Próxima clase"}
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-primary">
            {clase.materia}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-secondary">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {clase.horaInicio} – {clase.horaFin}
            </span>
            <span className="inline-flex items-center gap-1">
              {presencial ? (
                <MapPin className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Video className="h-3.5 w-3.5 shrink-0" />
              )}
              {edificio
                ? `${edificio.nombre}${clase.aula ? ` · ${clase.aula}` : ""}`
                : presencial
                  ? (clase.aula ?? "Sin edificio asignado")
                  : "Clase virtual"}
            </span>
            {clase.etiqueta && (
              <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium">
                {clase.etiqueta}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge tone={enCurso ? "success" : "accent"}>
            {enCurso
              ? `Termina ${formatearEspera(clase.minutos)}`
              : `Empieza ${formatearEspera(clase.minutos)}`}
          </StatusBadge>
          {edificio && (
            <button
              type="button"
              onClick={() => setMapaAbierto(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white shadow-[var(--shadow-card)] transition hover:bg-accent-hover"
            >
              <MapPin className="h-3.5 w-3.5" />
              Ver Edificio #{edificio.id}
            </button>
          )}
          {!edificio && !presencial && clase.aulaLink && (
            <a
              href={clase.aulaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-secondary transition hover:border-border-strong hover:text-primary"
            >
              <Video className="h-3.5 w-3.5" />
              Entrar a la clase
            </a>
          )}
        </div>
      </div>

      {edificio && (
        <Dialog open={mapaAbierto} onOpenChange={setMapaAbierto}>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogDescription className="text-[11px] font-medium uppercase tracking-wider">
                {clase.materia} · {clase.horaInicio}
              </DialogDescription>
              <DialogTitle>{edificio.nombre}</DialogTitle>
            </DialogHeader>
            <CampusMap activeEdificioId={edificio.id} aula={clase.aula} />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
