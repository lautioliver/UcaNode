import { Resend } from "resend";

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
  const html = `
    <p>Hola ${escapeHtml(nombre)},</p>
    <p>Gracias por registrarte en UcaNode. Hacé clic en el enlace para verificar tu email:</p>
    <p><a href="${verifyUrl}">Verificar email</a></p>
    <p>Este enlace expira en 24 horas. Si no creaste una cuenta, podés ignorar este mensaje.</p>
  `;

  const resend = getResendClient();
  if (!resend) {
    console.info(`[email] Verification link for ${to}: ${verifyUrl}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
