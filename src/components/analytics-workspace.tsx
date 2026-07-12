"use client";

import { useMemo, useState } from "react";
import {
  CounterChip,
  EmptyState,
  FilterPill,
  PageHeader,
  ProgressBar,
  SectionCard,
} from "@/components/layout";
import { tipoEntregaLabel } from "@/lib/labels";
import {
  computeAnalyticsKpis,
  entregasConNota,
  filterEntregas,
  formatDays,
  formatNota,
  formatPercent,
  topMateriasByEntregas,
  uniqueCuatrimestres,
  type EntregaAnalytics,
} from "@/lib/analytics-utils";
import type { TipoEntrega } from "@/generated/prisma/client";

type AnalyticsWorkspaceProps = {
  entregas: EntregaAnalytics[];
  materias: { id: string; nombre: string }[];
};

export function AnalyticsWorkspace({
  entregas,
  materias,
}: AnalyticsWorkspaceProps) {
  const [materiaId, setMateriaId] = useState("");
  const [cuatrimestre, setCuatrimestre] = useState<number | "">("");

  const cuatrimestres = useMemo(() => uniqueCuatrimestres(entregas), [entregas]);

  const filtered = useMemo(
    () =>
      filterEntregas(entregas, {
        materiaId: materiaId || undefined,
        cuatrimestre: cuatrimestre === "" ? undefined : cuatrimestre,
      }),
    [entregas, materiaId, cuatrimestre],
  );

  const kpis = useMemo(() => computeAnalyticsKpis(filtered), [filtered]);
  const topMaterias = useMemo(
    () => topMateriasByEntregas(filtered),
    [filtered],
  );
  const notas = useMemo(() => entregasConNota(filtered), [filtered]);
  const trackingLimitado =
    kpis.aTiempoBase < kpis.completadas ||
    kpis.duracionBase < kpis.completadas;

  return (
    <div className="space-y-8">
      <PageHeader
        pill="Progreso académico"
        title="Analíticas de entregas"
        description="Mirá cómo venís con tus entregas: completitud, puntualidad, notas y tiempos de trabajo."
      />

      <div className="flex flex-wrap gap-2">
        <CounterChip
          count={kpis.completadas}
          label="completadas"
          tone="success"
        />
        <CounterChip
          count={Math.round(kpis.tasaCompletitud * 100)}
          label="% completitud"
          tone="accent"
        />
        <CounterChip
          count={kpis.aTiempoBase > 0 ? Math.round(kpis.tasaATiempo * 100) : 0}
          label="% a tiempo"
          tone="warning"
        />
        <CounterChip
          count={kpis.notasCargadas}
          label="notas cargadas"
          tone="neutral"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill active={!materiaId} onClick={() => setMateriaId("")}>
          Todas las materias
        </FilterPill>
        {materias.map((m) => (
          <FilterPill
            key={m.id}
            active={materiaId === m.id}
            onClick={() => setMateriaId(m.id)}
          >
            {m.nombre}
          </FilterPill>
        ))}
      </div>

      {cuatrimestres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={cuatrimestre === ""}
            onClick={() => setCuatrimestre("")}
          >
            Todos los cuatrimestres
          </FilterPill>
          {cuatrimestres.map((c) => (
            <FilterPill
              key={c}
              active={cuatrimestre === c}
              onClick={() => setCuatrimestre(c)}
            >
              {c}° cuat.
            </FilterPill>
          ))}
        </div>
      )}

      {trackingLimitado && kpis.completadas > 0 && (
        <p className="rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-secondary">
          Algunas entregas completadas no tienen fecha de cierre registrada.
          Marcá &quot;En curso&quot; y luego &quot;Entregado&quot; para medir
          duración y puntualidad con precisión.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Resumen general">
          <dl className="grid gap-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-secondary">Total de entregas</dt>
              <dd className="font-semibold text-primary">{kpis.total}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-secondary">Tasa de completitud</dt>
              <dd className="font-semibold text-primary">
                {formatPercent(kpis.tasaCompletitud)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-secondary">Entregas a tiempo</dt>
              <dd className="font-semibold text-primary">
                {kpis.aTiempo}
                {kpis.aTiempoBase > 0
                  ? ` (${formatPercent(kpis.tasaATiempo)})`
                  : ""}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-secondary">Promedio de notas</dt>
              <dd className="font-semibold text-primary">
                {formatNota(kpis.promedioNotas)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-secondary">Duración promedio</dt>
              <dd className="font-semibold text-primary">
                {formatDays(kpis.duracionPromedioDias)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Por tipo">
          <div className="space-y-4">
            {(Object.keys(kpis.porTipo) as TipoEntrega[]).map((tipo) => (
              <div key={tipo} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">{tipoEntregaLabel[tipo]}</span>
                  <span className="font-semibold text-primary">
                    {kpis.porTipo[tipo]}
                  </span>
                </div>
                <ProgressBar
                  value={
                    kpis.total > 0
                      ? (kpis.porTipo[tipo] / kpis.total) * 100
                      : 0
                  }
                  tone="accent"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Top materias">
          {topMaterias.length === 0 ? (
            <EmptyState message="Todavía no hay entregas para mostrar por materia." />
          ) : (
            <div className="space-y-4">
              {topMaterias.map((materia) => (
                <div key={materia.materiaId} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-secondary">{materia.nombre}</span>
                    <span className="shrink-0 font-semibold text-primary">
                      {materia.completadas}/{materia.total}
                    </span>
                  </div>
                  <ProgressBar
                    value={
                      materia.total > 0
                        ? (materia.completadas / materia.total) * 100
                        : 0
                    }
                    tone="success"
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Parciales y finales con nota">
        {notas.length === 0 ? (
          <EmptyState message="Cargá la nota al editar un parcial o final cuando la recibas." />
        ) : (
          <ul className="divide-y divide-border">
            {notas.map((entrega) => (
              <li
                key={entrega.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">
                    {entrega.titulo}
                  </p>
                  <p className="text-xs text-muted">
                    {entrega.materiaNombre} · {entrega.tipoLabel}
                  </p>
                </div>
                <span className="rounded-full bg-accent-ghost px-3 py-1 text-sm font-semibold text-accent">
                  {entrega.nota}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
