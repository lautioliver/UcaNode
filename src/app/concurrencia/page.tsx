import type { Metadata } from "next";
import { CampusStatusWorkspace } from "@/components/campustatus-workspace";
import { fetchZones } from "@/lib/campustatus/client";

export const metadata: Metadata = {
  title: "Concurrencia — UcaNode",
};

export default async function ConcurrenciaPage() {
  const result = await fetchZones();

  return (
    <CampusStatusWorkspace
      zones={result.ok ? result.zones : []}
      error={result.ok ? undefined : result.message}
    />
  );
}
