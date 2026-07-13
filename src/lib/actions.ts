"use server";

import { revalidatePath, refresh } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  materiaSchema,
  entregaSchema,
  horarioSchema,
  linkSchema,
  perfilSchema,
  onboardingCarreraSchema,
} from "@/lib/schemas";
import { getCarreraCatalogo } from "@/lib/planes-estudio/catalogo";
import { hydrateCarrera } from "@/lib/planes-estudio/ingesta";
import { hashPassword } from "@/lib/password";
import { getOrCreatePerfil, setPerfilCookie } from "@/lib/perfil";
import { applyEstadoTimestamps, notaForTipo } from "@/lib/entrega-tracking";

async function sessionPerfil() {
  return getOrCreatePerfil();
}

async function ownedMateria(materiaId: string, perfilId: string) {
  return prisma.materia.findFirst({ where: { id: materiaId, perfilId } });
}

async function ownedEntrega(entregaId: string, perfilId: string) {
  return prisma.entrega.findFirst({
    where: { id: entregaId, materia: { perfilId } },
    include: { materia: true },
  });
}

async function ownedHorario(horarioId: string, perfilId: string) {
  return prisma.horario.findFirst({
    where: { id: horarioId, materia: { perfilId } },
    include: { materia: true },
  });
}

export type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function ok(message?: string): ActionResult {
  return { success: true, message };
}

function fail(message: string, errors?: Record<string, string[]>): ActionResult {
  return { success: false, message, errors };
}

async function checkLimit(): Promise<ActionResult | null> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return fail("Demasiadas solicitudes. Esperá un momento e intentá de nuevo.");
  }
  return null;
}

function safeStr(formData: FormData, key: string): string | null {
  const val = formData.get(key);
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === "" ? null : str;
}

function safeNum(formData: FormData, key: string): number | null {
  const val = safeStr(formData, key);
  if (val === null) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

// ── MATERIAS ──────────────────────────────────────────────

function revalidateMateria(id?: string) {
  revalidatePath("/");
  revalidatePath("/materias");
  if (id) revalidatePath(`/materias/${id}`);
}

export async function createMateria(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = materiaSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    codigo: safeStr(formData, "codigo"),
    estado: formData.get("estado") || "CURSANDO",
    cuatrimestre: safeNum(formData, "cuatrimestre"),
    anio: safeNum(formData, "anio"),
    profesor: safeStr(formData, "profesor"),
    semestre: safeStr(formData, "semestre"),
    correlativas: safeStr(formData, "correlativas"),
    notas: safeStr(formData, "notas"),
    promocional: formData.get("promocional") === "on",
    dia: safeStr(formData, "dia"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    await prisma.materia.create({ data: { ...parsed.data, perfilId: perfil.id } });
    revalidateMateria();
    refresh();
    return ok("Materia creada");
  } catch (e) {
    console.error("createMateria", e);
    return fail("Error al crear la materia");
  }
}

export async function updateMateria(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  const parsed = materiaSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    codigo: safeStr(formData, "codigo"),
    estado: formData.get("estado"),
    cuatrimestre: safeNum(formData, "cuatrimestre"),
    anio: safeNum(formData, "anio"),
    profesor: safeStr(formData, "profesor"),
    semestre: safeStr(formData, "semestre"),
    correlativas: safeStr(formData, "correlativas"),
    notas: safeStr(formData, "notas"),
    promocional: formData.get("promocional") === "on",
    dia: safeStr(formData, "dia"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    const updated = await prisma.materia.updateMany({
      where: { id, perfilId: perfil.id },
      data: parsed.data,
    });
    if (updated.count === 0) return fail("Materia no encontrada");
    revalidateMateria(id);
    refresh();
    return ok("Materia actualizada");
  } catch (e) {
    console.error("updateMateria", e);
    return fail("Error al actualizar la materia");
  }
}

export async function deleteMateria(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  try {
    const perfil = await sessionPerfil();
    const deleted = await prisma.materia.deleteMany({
      where: { id, perfilId: perfil.id },
    });
    if (deleted.count === 0) return fail("Materia no encontrada");
    revalidateMateria();
    refresh();
    return ok("Materia eliminada");
  } catch (e) {
    console.error("deleteMateria", e);
    return fail("Error al eliminar la materia");
  }
}

// ── ENTREGAS ──────────────────────────────────────────────

function revalidateEntrega(materiaId?: string) {
  revalidatePath("/");
  revalidatePath("/entregas");
  revalidatePath("/analytics");
  if (materiaId) revalidatePath(`/materias/${materiaId}`);
}

export async function createEntrega(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = entregaSchema.safeParse({
    titulo: safeStr(formData, "titulo"),
    tipo: formData.get("tipo"),
    fecha: safeStr(formData, "fecha"),
    estado: formData.get("estado") || "PENDIENTE",
    nota: safeNum(formData, "nota"),
    materiaId: safeStr(formData, "materiaId"),
    recurso: safeStr(formData, "recurso"),
    prioridad: safeStr(formData, "prioridad"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const timestamps = applyEstadoTimestamps(null, parsed.data.estado, {
    fechaInicio: null,
    fechaCompletada: null,
  });

  const dataCreate = {
    ...parsed.data,
    ...timestamps,
    nota: notaForTipo(parsed.data.tipo, parsed.data.nota),
  };

  try {
    const perfil = await sessionPerfil();
    if (!(await ownedMateria(parsed.data.materiaId, perfil.id))) {
      return fail("Materia no encontrada");
    }
    await prisma.entrega.create({ data: dataCreate });
    revalidateEntrega(parsed.data.materiaId);
    refresh();
    return ok("Entrega creada");
  } catch (e) {
    console.error("createEntrega", e);
    return fail("Error al crear la entrega");
  }
}

export async function updateEntrega(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  const parsed = entregaSchema.safeParse({
    titulo: safeStr(formData, "titulo"),
    tipo: formData.get("tipo"),
    fecha: safeStr(formData, "fecha"),
    estado: formData.get("estado"),
    nota: safeNum(formData, "nota"),
    materiaId: safeStr(formData, "materiaId"),
    recurso: safeStr(formData, "recurso"),
    prioridad: safeStr(formData, "prioridad"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    const existing = await ownedEntrega(id, perfil.id);
    if (!existing) return fail("Entrega no encontrada");
    if (!(await ownedMateria(parsed.data.materiaId, perfil.id))) {
      return fail("Materia no encontrada");
    }

    const timestamps = applyEstadoTimestamps(
      existing.estado,
      parsed.data.estado,
      {
        fechaInicio: existing.fechaInicio,
        fechaCompletada: existing.fechaCompletada,
      },
    );

    const dataUpdate = {
      ...parsed.data,
      ...timestamps,
      nota: notaForTipo(parsed.data.tipo, parsed.data.nota),
    };

    const updated = await prisma.entrega.updateMany({
      where: { id, materia: { perfilId: perfil.id } },
      data: dataUpdate,
    });
    if (updated.count === 0) return fail("Entrega no encontrada");
    revalidateEntrega(parsed.data.materiaId);
    refresh();
    return ok("Entrega actualizada");
  } catch (e) {
    console.error("updateEntrega", e);
    return fail("Error al actualizar la entrega");
  }
}

export async function toggleEntregaEstado(id: string): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  if (!id) return fail("ID requerido");

  try {
    const perfil = await sessionPerfil();
    const entrega = await ownedEntrega(id, perfil.id);
    if (!entrega) return fail("Entrega no encontrada");

    const nuevoEstado = entrega.estado === "ENTREGADO" ? "PENDIENTE" : "ENTREGADO";
    const timestamps = applyEstadoTimestamps(
      entrega.estado,
      nuevoEstado,
      {
        fechaInicio: entrega.fechaInicio,
        fechaCompletada: entrega.fechaCompletada,
      },
    );
    await prisma.entrega.update({
      where: { id: entrega.id },
      data: { estado: nuevoEstado, ...timestamps },
    });
    revalidateEntrega(entrega.materiaId);
    refresh();
    return ok(nuevoEstado === "ENTREGADO" ? "Marcada como entregada" : "Marcada como pendiente");
  } catch (e) {
    console.error("toggleEntregaEstado", e);
    return fail("Error al actualizar el estado");
  }
}

export async function deleteEntrega(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  try {
    const perfil = await sessionPerfil();
    const deleted = await prisma.entrega.deleteMany({
      where: { id, materia: { perfilId: perfil.id } },
    });
    if (deleted.count === 0) return fail("Entrega no encontrada");
    revalidateEntrega();
    refresh();
    return ok("Entrega eliminada");
  } catch (e) {
    console.error("deleteEntrega", e);
    return fail("Error al eliminar la entrega");
  }
}

// ── HORARIOS ──────────────────────────────────────────────

function revalidateHorario() {
  revalidatePath("/");
  revalidatePath("/horarios");
}

export async function createHorario(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = horarioSchema.safeParse({
    dia: formData.get("dia"),
    horaInicio: safeStr(formData, "horaInicio"),
    horaFin: safeStr(formData, "horaFin"),
    modalidad: formData.get("modalidad") || "PRESENCIAL",
    aulaLink: safeStr(formData, "aulaLink"),
    materiaId: safeStr(formData, "materiaId"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    if (!(await ownedMateria(parsed.data.materiaId, perfil.id))) {
      return fail("Materia no encontrada");
    }
    await prisma.horario.create({ data: parsed.data });
    revalidateHorario();
    refresh();
    return ok("Horario creado");
  } catch (e) {
    console.error("createHorario", e);
    return fail("Error al crear el horario");
  }
}

export async function updateHorario(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  const parsed = horarioSchema.safeParse({
    dia: formData.get("dia"),
    horaInicio: safeStr(formData, "horaInicio"),
    horaFin: safeStr(formData, "horaFin"),
    modalidad: formData.get("modalidad"),
    aulaLink: safeStr(formData, "aulaLink"),
    materiaId: safeStr(formData, "materiaId"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    if (!(await ownedMateria(parsed.data.materiaId, perfil.id))) {
      return fail("Materia no encontrada");
    }
    const updated = await prisma.horario.updateMany({
      where: { id, materia: { perfilId: perfil.id } },
      data: parsed.data,
    });
    if (updated.count === 0) return fail("Horario no encontrado");
    revalidateHorario();
    refresh();
    return ok("Horario actualizado");
  } catch (e) {
    console.error("updateHorario", e);
    return fail("Error al actualizar el horario");
  }
}

export async function deleteHorario(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  try {
    const perfil = await sessionPerfil();
    const deleted = await prisma.horario.deleteMany({
      where: { id, materia: { perfilId: perfil.id } },
    });
    if (deleted.count === 0) return fail("Horario no encontrado");
    revalidateHorario();
    refresh();
    return ok("Horario eliminado");
  } catch (e) {
    console.error("deleteHorario", e);
    return fail("Error al eliminar el horario");
  }
}

// ── LINKS ─────────────────────────────────────────────────

function revalidateLink() {
  revalidatePath("/");
  revalidatePath("/links");
}

export async function createLink(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = linkSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    url: safeStr(formData, "url"),
    categoria: formData.get("categoria") || "OTRO",
    favorito: formData.get("favorito") === "on",
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    await prisma.linkExterno.create({ data: { ...parsed.data, perfilId: perfil.id } });
    revalidateLink();
    refresh();
    return ok("Link creado");
  } catch (e) {
    console.error("createLink", e);
    return fail("Error al crear el link");
  }
}

export async function updateLink(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  const parsed = linkSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    url: safeStr(formData, "url"),
    categoria: formData.get("categoria"),
    favorito: formData.get("favorito") === "on",
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  try {
    const perfil = await sessionPerfil();
    const updated = await prisma.linkExterno.updateMany({
      where: { id, perfilId: perfil.id },
      data: parsed.data,
    });
    if (updated.count === 0) return fail("Link no encontrado");
    revalidateLink();
    refresh();
    return ok("Link actualizado");
  } catch (e) {
    console.error("updateLink", e);
    return fail("Error al actualizar el link");
  }
}

export async function deleteLink(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;
  const id = safeStr(formData, "id");
  if (!id) return fail("ID requerido");

  try {
    const perfil = await sessionPerfil();
    const deleted = await prisma.linkExterno.deleteMany({
      where: { id, perfilId: perfil.id },
    });
    if (deleted.count === 0) return fail("Link no encontrado");
    revalidateLink();
    refresh();
    return ok("Link eliminado");
  } catch (e) {
    console.error("deleteLink", e);
    return fail("Error al eliminar el link");
  }
}

// ── PERFIL ────────────────────────────────────────────────

function revalidateApp() {
  revalidatePath("/", "layout");
}

function revalidatePerfil() {
  revalidatePath("/");
  revalidatePath("/perfil");
  revalidateApp();
}

export async function confirmarCarrera(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = onboardingCarreraSchema.safeParse({
    perfilId: safeStr(formData, "perfilId"),
    carreraSlug: safeStr(formData, "carreraSlug"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { perfilId, carreraSlug } = parsed.data;

  if (!getCarreraCatalogo(carreraSlug)) {
    return fail("La carrera seleccionada no está disponible todavía.");
  }

  try {
    const perfil = await prisma.perfil.findUnique({ where: { id: perfilId } });
    if (!perfil) return fail("No se encontró el perfil del estudiante.");

    const carrera = await hydrateCarrera(carreraSlug);

    await prisma.perfil.update({
      where: { id: perfilId },
      data: { carreraId: carrera.id },
    });

    await setPerfilCookie(perfilId);

    revalidateApp();
    refresh();
    return ok("Plan de estudios listo");
  } catch (e: any) {
    console.error("confirmarCarrera", e);
    return fail(`Error: ${e?.message ?? e}`);
  }
}

export async function updatePerfil(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = perfilSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    emailUcasal: safeStr(formData, "emailUcasal"),
    anioIngreso: safeStr(formData, "anioIngreso"),
    legajo: safeStr(formData, "legajo"),
    password: safeStr(formData, "password"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { password, ...perfilData } = parsed.data;
  const passwordInput = password?.trim();

  try {
    const existing = await sessionPerfil();
    const data: typeof perfilData & { password?: string | null } = { ...perfilData };

    if (passwordInput) {
      data.password = await hashPassword(passwordInput);
    }

    await prisma.perfil.update({ where: { id: existing.id }, data });
    revalidatePerfil();
    refresh();
    return ok("Perfil guardado");
  } catch (e) {
    console.error("updatePerfil", e);
    return fail("Error al guardar el perfil");
  }
}
