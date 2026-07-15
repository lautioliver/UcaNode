import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import { sendVerificationEmail } from "@/lib/email";
import {
  RESEND_COOLDOWN_MS,
  TOKEN_TTL_MS,
  createRawVerificationToken,
  hashVerificationToken,
} from "@/lib/verification-token";

export { RESEND_COOLDOWN_MS, hashVerificationToken } from "@/lib/verification-token";

export async function createVerificationToken(perfilId: string) {
  const rawToken = createRawVerificationToken();
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { perfilId } }),
    prisma.emailVerificationToken.create({
      data: { tokenHash, perfilId, expiresAt },
    }),
  ]);

  return rawToken;
}

export type VerifyTokenResult =
  | { ok: true; perfilId: string }
  | { ok: false; reason: "invalid" | "expired" };

export async function verifyToken(rawToken: string): Promise<VerifyTokenResult> {
  const tokenHash = hashVerificationToken(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { perfil: true },
  });

  if (!record) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerificationToken.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.perfil.update({
      where: { id: record.perfilId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { perfilId: record.perfilId } }),
  ]);

  return { ok: true, perfilId: record.perfilId };
}

export async function canResendVerification(perfilId: string) {
  const latest = await prisma.emailVerificationToken.findFirst({
    where: { perfilId },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return true;
  return Date.now() - latest.createdAt.getTime() >= RESEND_COOLDOWN_MS;
}

export async function sendVerificationForPerfil(perfilId: string) {
  const perfil = await prisma.perfil.findUnique({ where: { id: perfilId } });
  if (!perfil?.emailUcasal) {
    throw new Error("Perfil sin email");
  }

  const rawToken = await createVerificationToken(perfilId);
  const verifyUrl = `${getAppUrl()}/api/auth/verificar?token=${encodeURIComponent(rawToken)}`;

  await sendVerificationEmail({
    to: perfil.emailUcasal,
    nombre: perfil.nombre,
    verifyUrl,
  });
}

export async function resendVerificationForEmail(email: string) {
  const perfil = await prisma.perfil.findUnique({ where: { emailUcasal: email } });
  if (!perfil?.password || perfil.emailVerifiedAt) {
    return { ok: true as const };
  }

  const allowed = await canResendVerification(perfil.id);
  if (!allowed) {
    return { ok: false as const, reason: "cooldown" as const };
  }

  await sendVerificationForPerfil(perfil.id);
  return { ok: true as const };
}
