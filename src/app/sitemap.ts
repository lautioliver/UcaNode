import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ucanode.vercel.app";

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/materias`, lastModified: new Date() },
    { url: `${base}/entregas`, lastModified: new Date() },
    { url: `${base}/analytics`, lastModified: new Date() },
    { url: `${base}/horarios`, lastModified: new Date() },
    { url: `${base}/links`, lastModified: new Date() },
    { url: `${base}/perfil`, lastModified: new Date() },
  ];
}
