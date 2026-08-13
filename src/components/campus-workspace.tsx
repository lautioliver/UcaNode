"use client";

import { useMemo, useState } from "react";
import { Building2, Landmark } from "lucide-react";
import { CampusMap, type OcupacionPunto } from "@/components/campus-map";
import { FilterPill, PageHeader, SectionCard } from "@/components/layout";
import {
  EDIFICIOS_LISTA,
  PUNTOS_CAMPUS,
  type CategoriaPunto,
  categoriaPuntoLabel,
} from "@/lib/campus/edificios";

const CATEGORIAS: CategoriaPunto[] = ["SERVICIO", "REFERENCIA", "DEPORTE"];

export function CampusWorkspace({
  ocupaciones,
  avisoCampuStatus,
}: {
  ocupaciones: OcupacionPunto[];
  avisoCampuStatus?: string;
}) {
  const [categorias, setCategorias] = useState<CategoriaPunto[]>(["SERVICIO"]);
  const [edificioActivo, setEdificioActivo] = useState<number | null>(null);

  const puntosVisibles = useMemo(
    () => PUNTOS_CAMPUS.filter((punto) => categorias.includes(punto.categoria)),
    [categorias],
  );

  const toggleCategoria = (categoria: CategoriaPunto) =>
    setCategorias((previas) =>
      previas.includes(categoria)
        ? previas.filter((c) => c !== categoria)
        : [...previas, categoria],
    );

  const academicas = EDIFICIOS_LISTA.filter((e) => e.categoria === "ACADEMICA");
  const institucionales = EDIFICIOS_LISTA.filter(
    (e) => e.categoria === "INSTITUCIONAL",
  );

  return (
    <main className="min-w-0 space-y-8">
      <PageHeader
        pill="Campus Castañares"
        title="Mapa del campus"
        description="Ubicá los 21 edificios del predio y los servicios que usás todos los días. Tocá un número para ver de qué facultad o dependencia se trata."
      />

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIAS.map((categoria) => (
          <FilterPill
            key={categoria}
            active={categorias.includes(categoria)}
            onClick={() => toggleCategoria(categoria)}
          >
            {categoriaPuntoLabel[categoria]}
          </FilterPill>
        ))}
        {ocupaciones.length > 0 && (
          <span className="text-xs text-muted">
            Los puntos con círculo de color tienen ocupación de CampuStatus.
          </span>
        )}
        {avisoCampuStatus && (
          <span className="text-xs text-muted">{avisoCampuStatus}</span>
        )}
      </div>

      <CampusMap
        activeEdificioId={edificioActivo}
        puntos={puntosVisibles}
        ocupaciones={ocupaciones}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Unidades académicas">
          <ListaEdificios
            edificios={academicas}
            activo={edificioActivo}
            onSelect={setEdificioActivo}
            Icon={Building2}
          />
        </SectionCard>
        <SectionCard title="Dependencias institucionales">
          <ListaEdificios
            edificios={institucionales}
            activo={edificioActivo}
            onSelect={setEdificioActivo}
            Icon={Landmark}
          />
        </SectionCard>
      </div>
    </main>
  );
}

function ListaEdificios({
  edificios,
  activo,
  onSelect,
  Icon,
}: {
  edificios: typeof EDIFICIOS_LISTA;
  activo: number | null;
  onSelect: (id: number) => void;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <ul className="space-y-2">
      {edificios.map((edificio) => {
        const esActivo = edificio.id === activo;
        return (
          <li key={edificio.id}>
            <button
              type="button"
              onClick={() => onSelect(edificio.id)}
              aria-pressed={esActivo}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                esActivo
                  ? "border-accent bg-accent-ghost"
                  : "border-border bg-surface hover:border-border-strong"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  esActivo
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-secondary"
                }`}
              >
                {edificio.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-primary">
                  {edificio.nombre}
                </span>
                <span className="block truncate text-[11px] text-muted">
                  {edificio.unidadAcademica}
                </span>
              </span>
              <Icon className="h-4 w-4 shrink-0 text-muted" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
