"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  type ZoneWithReflection,
} from "@/lib/campustatus/reflection";
import { countZonesByStatus } from "@/lib/campustatus/utils";

const REFLECTION_STORAGE_KEY = "ucanode_campustatus_reflections";

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
  const [displayZones, setDisplayZones] = useState<ZoneWithReflection[]>(() =>
    zones.map((zone) => ({ ...zone, reflectedAt: fetchedAt })),
  );

  useEffect(() => {
    if (!mounted) return;

    let stored: Record<string, { snapshot: string; reflectedAt: string }> = {};
    try {
      const raw = localStorage.getItem(REFLECTION_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          stored = parsed as Record<
            string,
            { snapshot: string; reflectedAt: string }
          >;
        }
      }
    } catch {
      stored = {};
    }

    const { zones: synced, stored: nextStored } = syncZoneReflections(
      zones,
      fetchedAt,
      stored,
    );

    localStorage.setItem(REFLECTION_STORAGE_KEY, JSON.stringify(nextStored));
    setDisplayZones(synced);
  }, [zones, fetchedAt, mounted]);

  const rojas = countZonesByStatus(displayZones, "Rojo");
  const amarillas = countZonesByStatus(displayZones, "Amarillo");

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Campus en vivo"
        title="Concurrencia"
        description={
          error ??
          "Estado de ocupación de espacios del campus, actualizado por la comunidad en CampuStatus."
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
