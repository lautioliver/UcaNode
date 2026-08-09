import { SecurityActionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  RESEND_COOLDOWN_MS,
  createRawVerificationToken,
  hashVerificationToken,
} from "@/lib/verification-token";

export const PASSWORD_CHANGE_TTL_MS = 60 * 60 * 1000;
export const EMAIL_CHANGE_TTL_MS = 24 * 60 * 60 * 1000;

export type EmailChangePayload = {
  newEmail: string;
};

function ttlForType(type: SecurityActionType) {
  return type === SecurityActionType.PASSWORD_CHANGE
    ? PASSWORD_CHANGE_TTL_MS
    : EMAIL_CHANGE_TTL_MS;
}

export async function createSecurityActionToken(
  perfilId: string,
  type: SecurityActionType,
  payload?: EmailChangePayload,
) {
  const rawToken = createRawVerificationToken();
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + ttlForType(type));

  await prisma.$transaction([
    prisma.securityActionToken.deleteMany({ where: { perfilId, type } }),
    prisma.securityActionToken.create({
      data: {
        tokenHash,
        perfilId,
        type,
        payload: payload ?? undefined,
        expiresAt,
      },
    }),
  ]);

  return rawToken;
}

export type PeekSecurityTokenResult =
  | {
      ok: true;
      perfilId: string;
      type: SecurityActionType;
      payload: EmailChangePayload | null;
      nombre: string;
      emailUcasal: string | null;
    }
  | { ok: false; reason: "invalid" | "expired" };

async function findSecurityTokenRecord(rawToken: string) {
  const tokenHash = hashVerificationToken(rawToken);
  return prisma.securityActionToken.findUnique({
    where: { tokenHash },
    include: { perfil: true },
  });
}

export async function peekSecurityToken(
  rawToken: string,
  expectedType?: SecurityActionType,
): Promise<PeekSecurityTokenResult> {
  const record = await findSecurityTokenRecord(rawToken);

  if (!record || (expectedType && record.type !== expectedType)) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.securityActionToken.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  const payload = record.payload as EmailChangePayload | null;

  return {
    ok: true,
    perfilId: record.perfilId,
    type: record.type,
    payload,
    nombre: record.perfil.nombre,
    emailUcasal: record.perfil.emailUcasal,
  };
}

export type ConsumeSecurityTokenResult =
  | {
      ok: true;
      perfilId: string;
      type: SecurityActionType;
      payload: EmailChangePayload | null;
    }
  | { ok: false; reason: "invalid" | "expired" };

export async function consumeSecurityToken(
  rawToken: string,
  expectedType: SecurityActionType,
): Promise<ConsumeSecurityTokenResult> {
  const record = await findSecurityTokenRecord(rawToken);

  if (!record || record.type !== expectedType) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.securityActionToken.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  await prisma.securityActionToken.delete({ where: { id: record.id } });

  return {
    ok: true,
    perfilId: record.perfilId,
    type: record.type,
    payload: record.payload as EmailChangePayload | null,
  };
}

export async function canResendSecurityAction(
  perfilId: string,
  type: SecurityActionType,
) {
  const latest = await prisma.securityActionToken.findFirst({
    where: { perfilId, type },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return true;
  return Date.now() - latest.createdAt.getTime() >= RESEND_COOLDOWN_MS;
}

export function isEligibleForPasswordRecovery(
  perfil: {
    password: string | null;
    emailVerifiedAt: Date | null;
    emailUcasal: string | null;
  } | null,
): perfil is {
  password: string;
  emailVerifiedAt: Date;
  emailUcasal: string;
} {
  return Boolean(
    perfil?.password && perfil.emailVerifiedAt && perfil.emailUcasal,
  );
}
