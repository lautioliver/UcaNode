"use client";

import { useActionState, useMemo, useState } from "react";
import {
  Check,
  Cpu,
  GraduationCap,
  Loader2,
  Search,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import {
  CARRERA_SOLICITUD_FORM_URL,
  carreraSolicitudFormDisponible,
} from "@/lib/planes-estudio/solicitud-carrera";
import { LogoMark } from "@/components/logo";

const input =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-accent focus:ring-2 focus:ring-accent/40";

const CARRERA_ICONS: Record<string, LucideIcon> = {
  "ingenieria-informatica-2015": Cpu,
};

function carreraBadges(carrera: CarreraCatalogo) {
  const badges: { label: string; className: string }[] = [
    {
      label: `Plan ${carrera.planAnio}`,
      className: "bg-surface-hover text-secondary",
    },
  ];

  if (carrera.modalidad) {
    badges.push({
      label: carrera.modalidad,
      className: "bg-sky-500/15 text-sky-400",
    });
  }

  if (carrera.duracionAnios > 0) {
    badges.push({
      label: `${carrera.duracionAnios} años`,
      className: "bg-violet-500/15 text-violet-400",
    });
  }

  if (carrera.resolucion) {
    badges.push({
      label: `Resolución ${carrera.resolucion}`,
      className: "bg-amber-600/20 text-amber-400",
    });
  }

  return badges;
}

function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function CarreraCard({
  carrera,
  selected,
  disabled,
  onSelect,
}: {
  carrera: CarreraCatalogo;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const Icon = CARRERA_ICONS[carrera.slug] ?? GraduationCap;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? "border-accent bg-accent-ghost shadow-[var(--shadow-card)]"
          : "border-border bg-surface-card hover:border-border-strong hover:bg-surface-hover"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
          selected
            ? "bg-accent text-white"
            : "bg-surface-hover text-accent group-hover:bg-accent-ghost"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm font-semibold leading-snug text-primary">
          {carrera.nombre}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {carreraBadges(carrera).map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
          selected
            ? "border-accent bg-accent text-white"
            : "border-border bg-surface text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

export function OnboardingCarrera({
  action,
  perfilId,
  carreras,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  perfilId: string;
  carreras: CarreraCatalogo[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    carreras.length === 1 ? carreras[0]?.slug ?? null : null,
  );

  const carrerasFiltradas = useMemo(() => {
    const key = normalizeSearch(query);
    if (!key) return carreras;

    return carreras.filter((carrera) => {
      const haystack = normalizeSearch(
        `${carrera.nombre} ${carrera.modalidad} ${carrera.planAnio} plan ${carrera.resolucion}`,
      );
      return haystack.includes(key);
    });
  }, [carreras, query]);

  const puedeConfirmar = selectedSlug != null && !pending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface-card p-8 shadow-[var(--shadow-card)]">
          <div className="mb-8 flex flex-col items-center text-center">
            <LogoMark className="mb-4 h-14 w-14" />
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              Elegí tu carrera
            </h1>
          </div>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="perfilId" value={perfilId} />
            <input type="hidden" name="carreraSlug" value={selectedSlug ?? ""} />

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar carrera…"
                disabled={pending}
                className={`${input} pl-9`}
                aria-label="Buscar carrera"
              />
            </div>

            <div className="space-y-2">
              {carrerasFiltradas.length > 0 ? (
                carrerasFiltradas.map((carrera) => (
                  <CarreraCard
                    key={carrera.slug}
                    carrera={carrera}
                    selected={selectedSlug === carrera.slug}
                    disabled={pending}
                    onSelect={() => setSelectedSlug(carrera.slug)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-secondary">
                    No encontramos carreras para &ldquo;{query}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-2 text-xs font-medium text-accent transition hover:text-accent-hover"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!puedeConfirmar}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparando tu plan…
                </>
              ) : selectedSlug ? (
                "Continuar con esta carrera"
              ) : (
                "Seleccioná una carrera para continuar"
              )}
            </button>

            {state.message && !state.success && (
              <p className="text-center text-sm text-danger">{state.message}</p>
            )}
          </form>
        </div>

        {carreraSolicitudFormDisponible() && (
          <p className="text-center text-xs text-muted">
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
    </div>
  );
}
