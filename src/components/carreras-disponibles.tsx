import { ExternalLink, GraduationCap } from "lucide-react";
import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import {
  CARRERA_SOLICITUD_FORM_URL,
  carreraSolicitudFormDisponible,
} from "@/lib/planes-estudio/solicitud-carrera";

export function CarrerasDisponibles({
  carreras,
  className,
}: {
  carreras: CarreraCatalogo[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Carreras disponibles
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <ul className="mt-4 space-y-2">
        {carreras.map((carrera) => (
          <li
            key={carrera.slug}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">{carrera.nombre}</p>
              <p className="text-xs text-muted">Plan {carrera.planAnio}</p>
            </div>
          </li>
        ))}
      </ul>

      {carreraSolicitudFormDisponible() && (
        <p className="mt-4 text-center text-xs text-muted">
          ¿Tu carrera no aparece?{" "}
          <a
            href={CARRERA_SOLICITUD_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent transition hover:text-accent-hover"
          >
            Pedila acá
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      )}
    </div>
  );
}
