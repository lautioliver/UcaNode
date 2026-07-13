import { z } from "zod";

const DEFAULT_BASE_URL = "https://campu-status.vercel.app";

const zoneStatusSchema = z.enum(["Verde", "Amarillo", "Rojo"]);
const zoneCapacitySchema = z.enum(["Baja", "Moderada", "Alta"]);

export const zoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: zoneStatusSchema,
  capacity: zoneCapacitySchema,
  occupancy: z.number().min(0).max(100),
  lastUpdate: z.string(),
  trend: z.array(z.number()),
  voteCount: z.number().int().nonnegative(),
});

export const zonesResponseSchema = z.object({
  zones: z.array(zoneSchema),
});

export type ZoneStatus = z.infer<typeof zoneStatusSchema>;
export type ZoneCapacity = z.infer<typeof zoneCapacitySchema>;
export type Zone = z.infer<typeof zoneSchema>;

export type FetchZonesResult =
  | { ok: true; zones: Zone[] }
  | { ok: false; message: string };

export class CampusStatusApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "CampusStatusApiError";
  }
}

function getBaseUrl(): string {
  const configured = process.env.CAMPUSSTATUS_URL?.trim();
  const base = configured || DEFAULT_BASE_URL;
  return base.replace(/\/+$/, "");
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new CampusStatusApiError(
      typeof body.error === "string" ? body.error : `Error ${response.status}`,
      response.status,
      typeof body.code === "string" ? body.code : undefined,
    );
  }

  return body as T;
}

export async function fetchZones(): Promise<FetchZonesResult> {
  try {
    const body = await request<unknown>("/api/zones");
    const parsed = zonesResponseSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[campustatus] Invalid zones response", parsed.error.flatten());
      return {
        ok: false,
        message: "No se pudo cargar el estado del campus.",
      };
    }

    return { ok: true, zones: parsed.data.zones };
  } catch (error) {
    if (error instanceof CampusStatusApiError) {
      console.error("[campustatus] API error", error.status, error.message);
    } else {
      console.error("[campustatus] Connection error", error);
    }

    return {
      ok: false,
      message: "No se pudo cargar el estado del campus.",
    };
  }
}
