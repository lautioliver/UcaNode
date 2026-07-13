import type { Zone, ZoneCapacity, ZoneStatus } from "@/lib/campustatus/client";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const statusToneMap: Record<ZoneStatus, Tone> = {
  Verde: "success",
  Amarillo: "warning",
  Rojo: "danger",
};

export function statusToTone(status: ZoneStatus): Tone {
  return statusToneMap[status];
}

export function capacityLabel(capacity: ZoneCapacity): string {
  return capacity;
}

export function countZonesByStatus(zones: Zone[], status: ZoneStatus): number {
  return zones.filter((zone) => zone.status === status).length;
}

export function maxTrendValue(trend: number[]): number {
  if (trend.length === 0) return 100;
  return Math.max(...trend, 1);
}

export function formatReflectedTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}
