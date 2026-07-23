"use server";

import type {
  EstadoEntrega,
  EstadoMateria,
  TipoEntrega,
} from "@/generated/prisma/client";
import { getPerfil } from "@/lib/perfil";
import { prisma } from "@/lib/prisma";

export type BusquedaMateria = {
  id: string;
  nombre: string;
  codigo: string | null;
  estado: EstadoMateria;
};

export type BusquedaEntrega = {
  id: string;
  titulo: string;
  materiaNombre: string;
  fecha: string;
  tipo: TipoEntrega;
  estado: EstadoEntrega;
};

export type BusquedaLink = {
  id: string;
  nombre: string;
  url: string;
};

export type BusquedaResultados = {
  materias: BusquedaMateria[];
  entregas: BusquedaEntrega[];
  links: BusquedaLink[];
};

const MAX_POR_GRUPO = 8;

const SIN_RESULTADOS: BusquedaResultados = {
  materias: [],
  entregas: [],
  links: [],
};

/** Quita acentos y pasa a minúsculas para comparar ("Matemática" ~ "matematica"). */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function buscarGlobal(query: string): Promise<BusquedaResultados> {
  const q = normalizar(query.trim());
  if (q.length < 2) return SIN_RESULTADOS;

  const perfil = await getPerfil();
  if (!perfil) return SIN_RESULTADOS;

  // Los datos son por perfil y chicos (decenas/cientos de filas), así que se
  // traen completos y se filtra en JS: Postgres sin `unaccent` no puede
  // matchear insensible a acentos con `contains`.
  const [materias, entregas, links] = await Promise.all([
    prisma.materia.findMany({
      where: { perfilId: perfil.id },
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        profesor: true,
        estado: true,
      },
    }),
    prisma.entrega.findMany({
      where: { materia: { perfilId: perfil.id } },
      orderBy: { fecha: "desc" },
      select: {
        id: true,
        titulo: true,
        fecha: true,
        tipo: true,
        estado: true,
        materia: { select: { nombre: true } },
      },
    }),
    prisma.linkExterno.findMany({
      where: { perfilId: perfil.id },
      orderBy: [{ favorito: "desc" }, { nombre: "asc" }],
      select: { id: true, nombre: true, url: true },
    }),
  ]);

  const matchea = (...campos: (string | null)[]) =>
    campos.some((campo) => campo !== null && normalizar(campo).includes(q));

  return {
    materias: materias
      .filter((m) => matchea(m.nombre, m.codigo, m.profesor))
      .slice(0, MAX_POR_GRUPO)
      .map((m) => ({
        id: m.id,
        nombre: m.nombre,
        codigo: m.codigo,
        estado: m.estado,
      })),
    entregas: entregas
      .filter((e) => matchea(e.titulo, e.materia.nombre))
      .slice(0, MAX_POR_GRUPO)
      .map((e) => ({
        id: e.id,
        titulo: e.titulo,
        materiaNombre: e.materia.nombre,
        fecha: e.fecha.toISOString(),
        tipo: e.tipo,
        estado: e.estado,
      })),
    links: links
      .filter((l) => matchea(l.nombre, l.url))
      .slice(0, MAX_POR_GRUPO),
  };
}
