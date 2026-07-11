import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Perfil } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

export { PERFIL_COOKIE } from "@/lib/session";

export async function getPerfilCookieId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(PERFIL_COOKIE)?.value;
}

export async function setPerfilCookie(perfilId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PERFIL_COOKIE, perfilId, perfilCookieOptions());
}

function placeholderEmail() {
  return `estudiante-${crypto.randomUUID()}@ucasal.edu.ar`;
}

export async function createPerfilSession() {
  return prisma.perfil.create({
    data: {
      nombre: "Estudiante",
      emailUcasal: placeholderEmail(),
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
