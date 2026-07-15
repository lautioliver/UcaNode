export const PRODUCTION_APP_URL = "https://ucanode.app";

/** URL pública del sitio (sitemap, robots, metadata). */
export function getSiteUrl(): string {
  return process.env.APP_URL?.replace(/\/$/, "") ?? PRODUCTION_APP_URL;
}

/** URL base para links de verificación y runtime local. */
export function getAppUrl(): string {
  return process.env.APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}
