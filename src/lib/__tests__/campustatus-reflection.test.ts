import { describe, expect, it } from "vitest";
import { syncZoneReflections } from "@/lib/campustatus/reflection";
import type { Zone } from "@/lib/campustatus/client";

const baseZone: Zone = {
  id: "biblioteca",
  name: "Biblioteca Central",
  status: "Verde",
  capacity: "Baja",
  occupancy: 22,
  lastUpdate: "14:20",
  trend: [22, 18, 25, 30, 28, 35, 32, 26],
  voteCount: 5,
};

describe("syncZoneReflections", () => {
  it("assigns fetchedAt when a zone is seen for the first time", () => {
    const { zones, stored } = syncZoneReflections(
      [baseZone],
      "2026-07-13T00:10:00.000Z",
    );

    expect(zones[0].reflectedAt).toBe("2026-07-13T00:10:00.000Z");
    expect(stored.biblioteca.reflectedAt).toBe("2026-07-13T00:10:00.000Z");
  });

  it("keeps the previous reflectedAt when occupancy data did not change", () => {
    const stored = {
      biblioteca: {
        snapshot: JSON.stringify({
          occupancy: 22,
          status: "Verde",
          capacity: "Baja",
          voteCount: 5,
          lastUpdate: "14:20",
          trend: [22, 18, 25, 30, 28, 35, 32, 26],
        }),
        reflectedAt: "2026-07-13T00:05:00.000Z",
      },
    };

    const { zones } = syncZoneReflections(
      [baseZone],
      "2026-07-13T00:10:00.000Z",
      stored,
    );

    expect(zones[0].reflectedAt).toBe("2026-07-13T00:05:00.000Z");
  });

  it("updates reflectedAt when occupancy changes", () => {
    const stored = {
      biblioteca: {
        snapshot: JSON.stringify({
          occupancy: 22,
          status: "Verde",
          capacity: "Baja",
          voteCount: 5,
          lastUpdate: "14:20",
          trend: [22, 18, 25, 30, 28, 35, 32, 26],
        }),
        reflectedAt: "2026-07-13T00:05:00.000Z",
      },
    };

    const updatedZone = { ...baseZone, occupancy: 58, status: "Amarillo" as const };
    const { zones } = syncZoneReflections(
      [updatedZone],
      "2026-07-13T00:12:00.000Z",
      stored,
    );

    expect(zones[0].reflectedAt).toBe("2026-07-13T00:12:00.000Z");
  });
});
