import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/app-url";
import { listUniversidadesPublicas } from "@/lib/universidades/catalogo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const hubs = listUniversidadesPublicas().map((universidad) => ({
    url: `${base}/u/${universidad.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    ...hubs,
    { url: `${base}/materias`, lastModified: new Date() },
    { url: `${base}/entregas`, lastModified: new Date() },
    { url: `${base}/analytics`, lastModified: new Date() },
    { url: `${base}/horarios`, lastModified: new Date() },
    { url: `${base}/concurrencia`, lastModified: new Date() },
    { url: `${base}/links`, lastModified: new Date() },
    { url: `${base}/perfil`, lastModified: new Date() },
  ];
}
