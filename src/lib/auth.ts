import type { Perfil } from "@/generated/prisma/client";

type PerfilAuthFields = Pick<
  Perfil,
  "emailUcasal" | "password" | "emailVerifiedAt"
>;

export function isPerfilRegistrado(
  perfil: PerfilAuthFields | null | undefined,
): boolean {
  return Boolean(
    perfil?.emailUcasal && perfil.password && perfil.emailVerifiedAt,
  );
}

export function isPerfilPendienteVerificacion(
  perfil: PerfilAuthFields | null | undefined,
): boolean {
  return Boolean(
    perfil?.emailUcasal && perfil.password && !perfil.emailVerifiedAt,
  );
}

export function safeAuthRedirect(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (
    next.startsWith("/login") ||
    next.startsWith("/registro") ||
    next.startsWith("/verificar-email")
  ) {
    return "/";
  }
  return next;
}
