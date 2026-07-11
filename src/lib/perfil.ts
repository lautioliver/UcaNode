import { cookies } from "next/headers";
import type { Perfil } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const PERFIL_COOKIE = "ucanode_perfil_id";

export async function getPerfilCookieId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(PERFIL_COOKIE)?.value;
}

export async function setPerfilCookie(perfilId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PERFIL_COOKIE, perfilId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

function placeholderEmail() {
  return `estudiante-${crypto.randomUUID()}@ucasal.edu.ar`;
}

export async function getOrCreatePerfil(): Promise<Perfil> {
  const cookieId = await getPerfilCookieId();
  if (cookieId) {
    const perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
    if (perfil) return perfil;
  }

  const perfil = await prisma.perfil.create({
    data: {
      nombre: "Estudiante",
      emailUcasal: placeholderEmail(),
      anioIngreso: new Date().getFullYear(),
    },
  });

  await setPerfilCookie(perfil.id);
  return perfil;
}

export async function getPerfilConCarrera() {
  const perfil = await getOrCreatePerfil();
  return prisma.perfil.findUnique({
    where: { id: perfil.id },
    include: { carrera: true },
  });
}
