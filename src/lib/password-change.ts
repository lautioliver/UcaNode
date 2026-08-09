import { SecurityActionType } from "@/generated/prisma/client";
import { getAppUrl } from "@/lib/app-url";
import {
  sendEmailChangeConfirmEmail,
  sendPasswordChangeEmail,
} from "@/lib/email-security";
import { sendVerificationForPerfil } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import {
  canResendSecurityAction,
  createSecurityActionToken,
  isEligibleForPasswordRecovery,
} from "@/lib/security-action";

const PASSWORD_RESET_OK_MESSAGE =
  "Si existe una cuenta con ese email, te enviamos un enlace para cambiar la contraseña.";

export async function sendPasswordChangeForPerfil(perfilId: string) {
  const perfil = await prisma.perfil.findUnique({ where: { id: perfilId } });
  if (!isEligibleForPasswordRecovery(perfil)) {
    throw new Error("Perfil no elegible para cambio de contraseña");
  }

  const allowed = await canResendSecurityAction(
    perfilId,
    SecurityActionType.PASSWORD_CHANGE,
  );
  if (!allowed) {
    return { ok: false as const, reason: "cooldown" as const };
  }

  const rawToken = await createSecurityActionToken(
    perfilId,
    SecurityActionType.PASSWORD_CHANGE,
  );
  const changeUrl = `${getAppUrl()}/cambiar-contrasena?token=${encodeURIComponent(rawToken)}`;

  await sendPasswordChangeEmail({
    to: perfil.emailUcasal,
    nombre: perfil.nombre,
    changeUrl,
  });

  return { ok: true as const };
}

export async function requestPasswordResetForEmail(email: string) {
  const perfil = await prisma.perfil.findUnique({
    where: { emailUcasal: email },
  });

  if (isEligibleForPasswordRecovery(perfil)) {
    try {
      await sendPasswordChangeForPerfil(perfil.id);
    } catch (e) {
      console.error("sendPasswordChangeForPerfil", e);
    }
  }

  return { ok: true as const, message: PASSWORD_RESET_OK_MESSAGE };
}

export async function sendEmailChangeForPerfil(
  perfilId: string,
  newEmail: string,
) {
  const perfil = await prisma.perfil.findUnique({ where: { id: perfilId } });
  if (!perfil?.emailUcasal || !perfil.emailVerifiedAt) {
    throw new Error("Perfil sin email verificado");
  }

  const allowed = await canResendSecurityAction(
    perfilId,
    SecurityActionType.EMAIL_CHANGE,
  );
  if (!allowed) {
    return { ok: false as const, reason: "cooldown" as const };
  }

  const rawToken = await createSecurityActionToken(
    perfilId,
    SecurityActionType.EMAIL_CHANGE,
    { newEmail },
  );
  const confirmUrl = `${getAppUrl()}/cambiar-email?token=${encodeURIComponent(rawToken)}`;

  await sendEmailChangeConfirmEmail({
    to: perfil.emailUcasal,
    nombre: perfil.nombre,
    currentEmail: perfil.emailUcasal,
    newEmail,
    confirmUrl,
  });

  return { ok: true as const };
}

export async function applyEmailChangeFromToken(perfilId: string, newEmail: string) {
  await prisma.perfil.update({
    where: { id: perfilId },
    data: {
      emailUcasal: newEmail,
      emailVerifiedAt: null,
    },
  });

  await sendVerificationForPerfil(perfilId);
}

export { PASSWORD_RESET_OK_MESSAGE };
