import type { Metadata } from "next";
import type { OcupacionPunto } from "@/components/campus-map";
import { CampusWorkspace } from "@/components/campus-workspace";
import { buscarPuntoPorZona } from "@/lib/campus/edificios";
import { fetchZones } from "@/lib/campustatus/client";

export const metadata: Metadata = {
  title: "Mapa del campus — UcaNode",
  description:
    "Mapa interactivo del Campus Castañares de UCASAL con los 21 edificios, servicios y referencias.",
};

export default async function CampusPage() {
  const result = await fetchZones();

  const ocupaciones: OcupacionPunto[] = [];
  if (result.ok) {
    const asignados = new Set<string>();
    for (const zone of result.zones) {
      const punto = buscarPuntoPorZona(zone.name);
      if (!punto || asignados.has(punto.id)) continue;
      asignados.add(punto.id);
      ocupaciones.push({
        puntoId: punto.id,
        zona: zone.name,
        status: zone.status,
        occupancy: zone.occupancy,
      });
    }
  }

  return (
    <CampusWorkspace
      ocupaciones={ocupaciones}
      avisoCampuStatus={
        result.ok ? undefined : "Sin datos de ocupación de CampuStatus por ahora."
      }
    />
  );
}
