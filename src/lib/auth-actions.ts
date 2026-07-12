"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { safeAuthRedirect, isPerfilRegistrado } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  clearPerfilCookie,
  getPerfilCookieId,
  setPerfilCookie,
} from "@/lib/perfil";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema, registroSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/actions";

function ok(message?: string): ActionResult {
  return { success: true, message };
}

function fail(message: string, errors?: Record<string, string[]>): ActionResult {
  return { success: false, message, errors };
}

function safeStr(formData: FormData, key: string): string | null {
  const val = formData.get(key);
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === "" ? null : str;
}

async function checkLimit(): Promise<ActionResult | null> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return fail("Demasiadas solicitudes. Esperá un momento e intentá de nuevo.");
  }
  return null;
}

async function guestPerfilId(): Promise<string | null> {
  const cookieId = await getPerfilCookieId();
  if (!cookieId) return null;

  const perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
  if (!perfil || isPerfilRegistrado(perfil)) return null;
  return perfil.id;
}

export async function login(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = loginSchema.safeParse({
    email: safeStr(formData, "email"),
    password: safeStr(formData, "password"),
    next: safeStr(formData, "next"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { email, password, next } = parsed.data;

  try {
    const perfil = await prisma.perfil.findUnique({ where: { emailUcasal: email } });
    if (!perfil?.password) {
      return fail("Email o contraseña incorrectos");
    }

    const valid = await verifyPassword(password, perfil.password);
    if (!valid) {
      return fail("Email o contraseña incorrectos");
    }

    await setPerfilCookie(perfil.id);
    revalidatePath("/", "layout");
    redirect(safeAuthRedirect(next));
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    console.error("login", e);
    return fail("No se pudo iniciar sesión");
  }
}

export async function registro(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const limit = await checkLimit();
  if (limit) return limit;

  const parsed = registroSchema.safeParse({
    nombre: safeStr(formData, "nombre"),
    email: safeStr(formData, "email"),
    password: safeStr(formData, "password"),
    confirmPassword: safeStr(formData, "confirmPassword"),
    next: safeStr(formData, "next"),
  });

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { nombre, email, password, next } = parsed.data;
  const passwordHash = await hashPassword(password);

  try {
    const existing = await prisma.perfil.findUnique({ where: { emailUcasal: email } });
    if (existing && isPerfilRegistrado(existing)) {
      return fail("Ya existe una cuenta con ese email");
    }

    const adoptId = await guestPerfilId();

    if (adoptId) {
      if (existing && existing.id !== adoptId) {
        return fail("Ya existe una cuenta con ese email");
      }

      await prisma.perfil.update({
        where: { id: adoptId },
        data: {
          nombre,
          emailUcasal: email,
          password: passwordHash,
        },
      });
      await setPerfilCookie(adoptId);
    } else if (existing) {
      await prisma.perfil.update({
        where: { id: existing.id },
        data: {
          nombre,
          password: passwordHash,
        },
      });
      await setPerfilCookie(existing.id);
    } else {
      const perfil = await prisma.perfil.create({
        data: {
          nombre,
          emailUcasal: email,
          password: passwordHash,
          anioIngreso: new Date().getFullYear(),
        },
      });
      await setPerfilCookie(perfil.id);
    }

    revalidatePath("/", "layout");
    redirect(safeAuthRedirect(next));
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    console.error("registro", e);
    return fail("No se pudo crear la cuenta");
  }
}

export async function logout() {
  await clearPerfilCookie();
  revalidatePath("/", "layout");
  redirect("/login");
}
