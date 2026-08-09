import { createElement } from "react";
import { Resend } from "resend";
import { CambiarContrasenaEmail } from "@/emails/CambiarContrasenaEmail";
import { ConfirmarCambioEmail } from "@/emails/ConfirmarCambioEmail";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM ?? "UcaNode <onboarding@resend.dev>";
}

type SendPasswordChangeEmailInput = {
  to: string;
  nombre: string;
  changeUrl: string;
};

export async function sendPasswordChangeEmail({
  to,
  nombre,
  changeUrl,
}: SendPasswordChangeEmailInput): Promise<void> {
  const subject = "Cambiá tu contraseña — UcaNode";

  const resend = getResendClient();
  if (!resend) {
    console.info(`[email] Password change link for ${to}: ${changeUrl}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    react: createElement(CambiarContrasenaEmail, { nombre, changeUrl }),
  });

  if (error) {
    throw new Error(error.message);
  }
}

type SendEmailChangeConfirmEmailInput = {
  to: string;
  nombre: string;
  currentEmail: string;
  newEmail: string;
  confirmUrl: string;
};

export async function sendEmailChangeConfirmEmail({
  to,
  nombre,
  currentEmail,
  newEmail,
  confirmUrl,
}: SendEmailChangeConfirmEmailInput): Promise<void> {
  const subject = "Confirmá el cambio de email — UcaNode";

  const resend = getResendClient();
  if (!resend) {
    console.info(
      `[email] Email change confirm for ${to}: ${currentEmail} -> ${newEmail} (${confirmUrl})`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    react: createElement(ConfirmarCambioEmail, {
      nombre,
      currentEmail,
      newEmail,
      confirmUrl,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
