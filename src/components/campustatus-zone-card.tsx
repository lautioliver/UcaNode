import {
  Card,
  ProgressBar,
  StatusBadge,
} from "@/components/layout";
import type { Zone } from "@/lib/campustatus/client";
import {
  capacityLabel,
  maxTrendValue,
  statusToTone,
} from "@/lib/campustatus/utils";

function TrendSparkline({ trend }: { trend: number[] }) {
  if (trend.length === 0) {
    return (
      <div className="h-10 rounded-lg border border-dashed border-border bg-surface px-2 py-2 text-center text-[10px] text-muted">
        Sin historial
      </div>
    );
  }

  const max = maxTrendValue(trend);

  return (
    <div
      className="flex h-10 items-end gap-1 rounded-lg border border-border bg-surface px-2 py-2"
      aria-hidden
    >
      {trend.map((value, index) => {
        const height = Math.max(12, Math.round((value / max) * 100));
        return (
          <div
            key={`${value}-${index}`}
            className="flex-1 rounded-sm bg-accent/70"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function formatLastUpdate(lastUpdate: string): string {
  const match = lastUpdate.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return lastUpdate;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const totalMs = (hours * 60 + minutes) * 60 * 1000;
  const date = new Date(Date.now() - totalMs);
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function CampusStatusZoneCard({ zone }: { zone: Zone }) {
  const tone = statusToTone(zone.status);

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-base font-semibold text-primary">
            {zone.name}
          </h3>
          <p className="text-xs text-muted">
            Capacidad {capacityLabel(zone.capacity).toLowerCase()}
          </p>
        </div>
        <StatusBadge tone={tone} className="shrink-0">
          {zone.status}
        </StatusBadge>
      </div>

      <ProgressBar
        value={zone.occupancy}
        tone={tone}
        label="Ocupación"
      />

      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Tendencia reciente
        </p>
        <TrendSparkline trend={zone.trend} />
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary">
        <span>Actualizado {formatLastUpdate(zone.lastUpdate)}</span>
        <span className="text-muted">·</span>
        <span>
          {zone.voteCount} reporte{zone.voteCount === 1 ? "" : "s"}
        </span>
      </div>
    </Card>
  );
}
