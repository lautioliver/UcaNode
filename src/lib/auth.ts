import type { Perfil } from "@/generated/prisma/client";

export function isPerfilRegistrado(
  perfil: Pick<Perfil, "emailUcasal" | "password"> | null | undefined,
): boolean {
  return Boolean(perfil?.emailUcasal && perfil.password);
}

export function safeAuthRedirect(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (next.startsWith("/login") || next.startsWith("/registro")) return "/";
  return next;
}
