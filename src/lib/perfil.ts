import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Perfil } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  PERFIL_COOKIE,
  SESSION_VERSION_COOKIE,
  sessionCookieEntries,
  sessionCookieNames,
} from "@/lib/session";

export { PERFIL_COOKIE } from "@/lib/session";

const PLACEHOLDER_EMAIL_RE =
  /^estudiante-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@ucasal\.edu\.ar$/i;

export function displayEmailUcasal(email: string | null | undefined): string {
  if (!email || PLACEHOLDER_EMAIL_RE.test(email)) return "";
  return email;
}

export function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/registro") ||
    pathname.startsWith("/verificar-email") ||
    pathname.startsWith("/terminos-y-condiciones") ||
    pathname.startsWith("/novedades") ||
    pathname.startsWith("/cambiar-contrasena") ||
    pathname.startsWith("/cambiar-email") ||
    pathname.startsWith("/recuperar-contrasena")
  );
}

export async function getPerfilCookieId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(PERFIL_COOKIE)?.value;
}

export async function getSessionVersionFromCookie(): Promise<number | undefined> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_VERSION_COOKIE)?.value;
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function setSessionCookies(perfilId: string, sessionVersion: number) {
  const cookieStore = await cookies();
  for (const entry of sessionCookieEntries(perfilId, sessionVersion)) {
    cookieStore.set(entry.name, entry.value, entry.options);
  }
}

/** @deprecated Use setSessionCookies(perfilId, sessionVersion) */
export async function setPerfilCookie(perfilId: string) {
  const perfil = await prisma.perfil.findUnique({ where: { id: perfilId } });
  await setSessionCookies(perfilId, perfil?.sessionVersion ?? 0);
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  for (const name of sessionCookieNames()) {
    cookieStore.delete(name);
  }
}

/** @deprecated Use clearSessionCookies() */
export async function clearPerfilCookie() {
  await clearSessionCookies();
}

function sessionVersionMatches(
  cookieVersion: number | undefined,
  expectedVersion: number,
) {
  if (cookieVersion === undefined) {
    return expectedVersion === 0;
  }
  return cookieVersion === expectedVersion;
}

export async function getPerfil(): Promise<Perfil | null> {
  const cookieId = await getPerfilCookieId();
  if (!cookieId) return null;

  const perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
  if (!perfil) {
    await clearSessionCookies();
    return null;
  }

  const cookieVersion = await getSessionVersionFromCookie();
  if (!sessionVersionMatches(cookieVersion, perfil.sessionVersion)) {
    await clearSessionCookies();
    return null;
  }

  return perfil;
}

async function loginRedirectPath(): Promise<string> {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";
  if (isAuthPath(pathname)) return "/login";
  return `/login?next=${encodeURIComponent(pathname)}`;
}

export async function requirePerfil(): Promise<Perfil> {
  const perfil = await getPerfil();
  if (perfil) return perfil;

  redirect(await loginRedirectPath());
}

/** @deprecated Use requirePerfil() — kept for page imports */
export async function getOrCreatePerfil(): Promise<Perfil> {
  return requirePerfil();
}

export async function getPerfilConCarrera() {
  const perfil = await requirePerfil();
  return prisma.perfil.findUnique({
    where: { id: perfil.id },
    include: { carrera: true },
  });
}
