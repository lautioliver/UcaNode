import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchZones } from "@/lib/campustatus/client";

const validZone = {
  id: "biblioteca",
  name: "Biblioteca Central",
  status: "Verde",
  capacity: "Baja",
  occupancy: 22,
  lastUpdate: "14:20",
  trend: [22, 18, 25, 30, 28, 35, 32, 26],
  voteCount: 5,
};

describe("fetchZones", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("parses a valid zones response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ zones: [validZone] }), { status: 200 }),
    );

    const result = await fetchZones();

    expect(result).toEqual({ ok: true, zones: [validZone] });
    expect(fetch).toHaveBeenCalledWith(
      "https://campu-status.vercel.app/api/zones",
      expect.objectContaining({
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }),
    );
  });

  it("returns an error for invalid JSON shape", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ zones: [{ id: "broken" }] }), {
        status: 200,
      }),
    );

    const result = await fetchZones();

    expect(result).toEqual({
      ok: false,
      message: "No se pudo cargar el estado del campus.",
    });
  });

  it("returns an error when the API responds with 500", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
      }),
    );

    const result = await fetchZones();

    expect(result).toEqual({
      ok: false,
      message: "No se pudo cargar el estado del campus.",
    });
  });

  it("returns an error on connection failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const result = await fetchZones();

    expect(result).toEqual({
      ok: false,
      message: "No se pudo cargar el estado del campus.",
    });
  });
});
