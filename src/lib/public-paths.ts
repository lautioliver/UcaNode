/** Landing y hubs de universidad: públicas, sin cookie ni shell autenticado. */
export function isPublicMarketingPath(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/u/");
}
