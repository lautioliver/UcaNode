import type { Perfil } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getOrCreatePerfil(): Promise<Perfil> {
  const existing = await prisma.perfil.findFirst();
  if (existing) return existing;

  return prisma.perfil.create({
    data: {
      nombre: "Estudiante",
      emailUcasal: "estudiante@ucasal.edu.ar",
      anioIngreso: new Date().getFullYear(),
    },
  });
}

export async function getPerfilConCarrera() {
  return prisma.perfil.findFirst({
    include: { carrera: true },
  });
}
