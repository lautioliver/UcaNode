import type { Zone } from "@/lib/campustatus/client";

export type ZoneWithReflection = Zone & { reflectedAt: string };

export type StoredZoneReflection = {
  snapshot: string;
  reflectedAt: string;
};

export type ReflectionStore = Record<string, StoredZoneReflection>;

export function zoneSnapshot(zone: Zone): string {
  return JSON.stringify({
    occupancy: zone.occupancy,
    status: zone.status,
    capacity: zone.capacity,
    voteCount: zone.voteCount,
    lastUpdate: zone.lastUpdate,
    trend: zone.trend,
  });
}

export function syncZoneReflections(
  zones: Zone[],
  fetchedAt: string,
  stored: ReflectionStore = {},
): { zones: ZoneWithReflection[]; stored: ReflectionStore } {
  const nextStored: ReflectionStore = { ...stored };

  const zonesWithReflection = zones.map((zone) => {
    const snapshot = zoneSnapshot(zone);
    const previous = stored[zone.id];
    const reflectedAt =
      !previous || previous.snapshot !== snapshot
        ? fetchedAt
        : previous.reflectedAt;

    nextStored[zone.id] = { snapshot, reflectedAt };
    return { ...zone, reflectedAt };
  });

  return { zones: zonesWithReflection, stored: nextStored };
}
