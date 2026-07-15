import { prisma } from "@/lib/prisma";
import { isPerfilRegistrado } from "@/lib/auth";
import {
  resendVerificationForEmail,
  sendVerificationForPerfil,
} from "@/lib/email-verification";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getPerfilCookieId } from "@/lib/perfil";
import { loginSchema, registroSchema } from "@/lib/schemas";

export type AuthServiceResult =
  | { ok: true; perfilId: string; pendingVerification?: boolean }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
      pendingVerification?: boolean;
      email?: string;
    };

type AuthFormInput = {
  nombre?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  next?: string | null;
};

function fail(
  message: string,
  errors?: Record<string, string[]>,
  meta?: { pendingVerification?: boolean; email?: string },
): AuthServiceResult {
  return { ok: false, message, errors, ...meta };
}

function field(formData: FormData, key: string): string | null {
  const val = formData.get(key);
  if (val == null) return null;
  const str = String(val).trim();
  return str === "" ? null : str;
}

export function parseAuthForm(formData: FormData): AuthFormInput {
  return {
    nombre: field(formData, "nombre"),
    email: field(formData, "email"),
    password: field(formData, "password"),
    confirmPassword: field(formData, "confirmPassword"),
    next: field(formData, "next"),
  };
}

async function guestPerfilId(): Promise<string | null> {
  const cookieId = await getPerfilCookieId();
  if (!cookieId) return null;

  const perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
  if (!perfil || isPerfilRegistrado(perfil)) return null;
  return perfil.id;
}

export async function loginWithCredentials(
  input: AuthFormInput,
): Promise<AuthServiceResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;
  const perfil = await prisma.perfil.findUnique({ where: { emailUcasal: email } });

  if (!perfil?.password) {
    return fail("Email o contraseña incorrectos");
  }

  const valid = await verifyPassword(password, perfil.password);
  if (!valid) {
    return fail("Email o contraseña incorrectos");
  }

  if (!perfil.emailVerifiedAt) {
    try {
      await resendVerificationForEmail(email);
    } catch (e) {
      console.error("resendVerificationForEmail", e);
    }

    return fail("Verificá tu email antes de iniciar sesión", undefined, {
      pendingVerification: true,
      email,
    });
  }

  await clearFantasma(perfil.id);
  return { ok: true, perfilId: perfil.id };
}

async function clearFantasma(perfilId: string) {
  await prisma.perfil.update({
    where: { id: perfilId },
    data: { fantasma: false },
  });
}

export async function registerAccount(
  input: AuthFormInput,
): Promise<AuthServiceResult> {
  const parsed = registroSchema.safeParse(input);

  if (!parsed.success) {
    return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  }

  const { nombre, email, password } = parsed.data;
  const passwordHash = await hashPassword(password);
  const existing = await prisma.perfil.findUnique({ where: { emailUcasal: email } });

  if (existing && isPerfilRegistrado(existing)) {
    return fail("Ya existe una cuenta con ese email");
  }

  const adoptId = await guestPerfilId();
  let perfilId: string;

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
        emailVerifiedAt: null,
        fantasma: false,
      },
    });
    perfilId = adoptId;
  } else if (existing) {
    await prisma.perfil.update({
      where: { id: existing.id },
      data: {
        nombre,
        password: passwordHash,
        emailVerifiedAt: null,
        fantasma: false,
      },
    });
    perfilId = existing.id;
  } else {
    const perfil = await prisma.perfil.create({
      data: {
        nombre,
        emailUcasal: email,
        password: passwordHash,
        emailVerifiedAt: null,
        fantasma: false,
        anioIngreso: new Date().getFullYear(),
      },
    });
    perfilId = perfil.id;
  }

  try {
    await sendVerificationForPerfil(perfilId);
  } catch (e) {
    console.error("sendVerificationForPerfil", e);
    return fail(
      "No pudimos enviar el email de verificación. Intentá de nuevo más tarde.",
    );
  }

  return { ok: true, perfilId, pendingVerification: true };
}
