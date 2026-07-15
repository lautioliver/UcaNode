import { createElement } from "react";
import { Resend } from "resend";
import { ConfirmarEmail } from "@/emails/ConfirmarEmail";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM ?? "UcaNode <onboarding@resend.dev>";
}

type SendVerificationEmailInput = {
  to: string;
  nombre: string;
  verifyUrl: string;
};

export async function sendVerificationEmail({
  to,
  nombre,
  verifyUrl,
}: SendVerificationEmailInput): Promise<void> {
  const subject = "Verificá tu email — UcaNode";

  const resend = getResendClient();
  if (!resend) {
    console.info(`[email] Verification link for ${to}: ${verifyUrl}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    react: createElement(ConfirmarEmail, { nombre, verifyUrl }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
