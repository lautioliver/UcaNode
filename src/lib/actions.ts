"use server";

import { revalidatePath } from "next/cache";
import {
  CategoriaLink,
  DiaSemana,
  EstadoEntrega,
  EstadoMateria,
  Modalidad,
  TipoEntrega,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createMateria(formData: FormData) {
  await prisma.materia.create({
    data: {
      nombre: String(formData.get("nombre")),
      codigo: String(formData.get("codigo") || "") || null,
      estado: (formData.get("estado") as EstadoMateria) || EstadoMateria.CURSANDO,
      cuatrimestre: formData.get("cuatrimestre")
        ? Number(formData.get("cuatrimestre"))
        : null,
      anio: formData.get("anio") ? Number(formData.get("anio")) : null,
      profesor: String(formData.get("profesor") || "") || null,
      semestre: String(formData.get("semestre") || "") || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/materias");
}

export async function createEntrega(formData: FormData) {
  await prisma.entrega.create({
    data: {
      titulo: String(formData.get("titulo")),
      tipo: formData.get("tipo") as TipoEntrega,
      fecha: new Date(String(formData.get("fecha"))),
      estado:
        (formData.get("estado") as EstadoEntrega) || EstadoEntrega.PENDIENTE,
      materiaId: String(formData.get("materiaId")),
      recurso: String(formData.get("recurso") || "") || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/entregas");
}

export async function createHorario(formData: FormData) {
  await prisma.horario.create({
    data: {
      dia: formData.get("dia") as DiaSemana,
      horaInicio: String(formData.get("horaInicio")),
      horaFin: String(formData.get("horaFin")),
      modalidad:
        (formData.get("modalidad") as Modalidad) || Modalidad.PRESENCIAL,
      aulaLink: String(formData.get("aulaLink") || "") || null,
      materiaId: String(formData.get("materiaId")),
    },
  });
  revalidatePath("/horarios");
}

export async function createLink(formData: FormData) {
  await prisma.linkExterno.create({
    data: {
      nombre: String(formData.get("nombre")),
      url: String(formData.get("url")),
      categoria:
        (formData.get("categoria") as CategoriaLink) || CategoriaLink.OTRO,
      favorito: formData.get("favorito") === "on",
    },
  });
  revalidatePath("/links");
}

export async function updatePerfil(formData: FormData) {
  const data = {
    nombre: String(formData.get("nombre")),
    emailUcasal: String(formData.get("emailUcasal")),
    carrera: String(formData.get("carrera")),
    anioIngreso: Number(formData.get("anioIngreso")),
    legajo: String(formData.get("legajo") || "") || null,
  };

  const existing = await prisma.perfil.findFirst();
  if (existing) {
    await prisma.perfil.update({ where: { id: existing.id }, data });
  } else {
    await prisma.perfil.create({ data });
  }

  revalidatePath("/perfil");
  revalidatePath("/");
}
