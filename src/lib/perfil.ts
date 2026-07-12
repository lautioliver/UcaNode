import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Perfil } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

export { PERFIL_COOKIE } from "@/lib/session";

const PLACEHOLDER_EMAIL_RE =
  /^estudiante-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@ucasal\.edu\.ar$/i;

export function displayEmailUcasal(email: string | null | undefined): string {
  if (!email || PLACEHOLDER_EMAIL_RE.test(email)) return "";
  return email;
}

export async function getPerfilCookieId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(PERFIL_COOKIE)?.value;
}

export async function setPerfilCookie(perfilId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PERFIL_COOKIE, perfilId, perfilCookieOptions());
}

export async function clearPerfilCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PERFIL_COOKIE);
}

export async function createPerfilSession() {
  return prisma.perfil.create({
    data: {
      nombre: "Estudiante",
      anioIngreso: new Date().getFullYear(),
    },
  });
}

export async function getOrCreatePerfil(): Promise<Perfil> {
  const cookieId = await getPerfilCookieId();
  if (cookieId) {
    const perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
    if (perfil) return perfil;
  }

  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";
  redirect(`/api/session?next=${encodeURIComponent(pathname)}`);
}

export async function getPerfilConCarrera() {
  const perfil = await getOrCreatePerfil();
  return prisma.perfil.findUnique({
    where: { id: perfil.id },
    include: { carrera: true },
  });
}
