"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { CampusStatusZoneCard } from "@/components/campustatus-zone-card";
import {
  CounterChip,
  EmptyState,
  PageHeader,
} from "@/components/layout";
import type { Zone } from "@/lib/campustatus/client";
import {
  syncZoneReflections,
  type ReflectionStore,
} from "@/lib/campustatus/reflection";
import { countZonesByStatus } from "@/lib/campustatus/utils";

const REFLECTION_STORAGE_KEY = "ucanode_campustatus_reflections";

function readStoredReflections(): ReflectionStore {
  try {
    const raw = localStorage.getItem(REFLECTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as ReflectionStore;
    }
  } catch {
    // JSON inválido o storage inaccesible: se parte de cero
  }
  return {};
}

type CampusStatusWorkspaceProps = {
  zones: Zone[];
  fetchedAt: string;
  error?: string;
};

function RefreshButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-secondary transition hover:border-border-strong hover:text-primary"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Actualizar
    </button>
  );
}

export function CampusStatusWorkspace({
  zones,
  fetchedAt,
  error,
}: CampusStatusWorkspaceProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // Deriva las zonas con su "reflectedAt" en render (localStorage solo existe
  // en el cliente); el efecto de abajo solo persiste el store actualizado.
  const { zones: displayZones, stored: nextStored } = useMemo(() => {
    if (!mounted) {
      return {
        zones: zones.map((zone) => ({ ...zone, reflectedAt: fetchedAt })),
        stored: null,
      };
    }
    return syncZoneReflections(zones, fetchedAt, readStoredReflections());
  }, [zones, fetchedAt, mounted]);

  useEffect(() => {
    if (!nextStored) return;
    localStorage.setItem(REFLECTION_STORAGE_KEY, JSON.stringify(nextStored));
  }, [nextStored]);

  const rojas = countZonesByStatus(displayZones, "Rojo");
  const amarillas = countZonesByStatus(displayZones, "Amarillo");

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Campus en vivo"
        title="Concurrencia"
        description={
          error ??
          "Consultá la ocupación del campus en tiempo real gracias a CampuStatus."
        }
        action={<RefreshButton />}
      />

      {error ? (
        <EmptyState message="Intentá actualizar en unos minutos o volvé más tarde." />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <CounterChip count={displayZones.length} label="zonas" tone="accent" />
            <CounterChip count={rojas} label="en rojo" tone="danger" />
            <CounterChip count={amarillas} label="en amarillo" tone="warning" />
          </div>

          {displayZones.length > 0 ? (
            <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayZones.map((zone) => (
                <CampusStatusZoneCard key={zone.id} zone={zone} />
              ))}
            </div>
          ) : (
            <EmptyState message="No hay zonas activas por ahora." />
          )}
        </>
      )}
    </main>
  );
}
