import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Verificá tu email — UcaNode",
};

const messages: Record<string, string> = {
  invalid: "El enlace de verificación no es válido.",
  expired: "El enlace expiró. Pedí uno nuevo.",
  cooldown: "Esperá un minuto antes de reenviar el email.",
  send_failed: "No pudimos enviar el email. Intentá de nuevo más tarde.",
  rate_limit: "Demasiadas solicitudes. Esperá un momento e intentá de nuevo.",
  invalid_email: "Ingresá un email válido.",
};

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    error?: string;
    sent?: string;
    next?: string;
  }>;
}) {
  const { email, error, sent } = await searchParams;
  const errorMessage = error ? messages[error] ?? "Ocurrió un error." : null;

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </Link>

        <div className="flex flex-1 flex-col justify-center space-y-6">
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] sm:p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Mail className="h-5 w-5" />
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              Verificá tu email
            </h1>
            <p className="mt-2 text-sm text-secondary">
              {email
                ? `Te enviamos un enlace a ${email}. Abrilo para activar tu cuenta.`
                : "Te enviamos un enlace de verificación. Abrilo para activar tu cuenta."}
            </p>
            <p className="mt-2 text-xs text-muted">
              El enlace expira en 24 horas. Revisá también la carpeta de spam.
            </p>

            {sent === "1" ? (
              <p className="mt-4 text-sm text-accent">Email enviado correctamente.</p>
            ) : null}
            {errorMessage ? (
              <p className="mt-4 text-sm text-danger">{errorMessage}</p>
            ) : null}

            <form
              action="/api/auth/reenviar-verificacion"
              method="POST"
              className="mt-6 space-y-4"
            >
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={email ?? ""}
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-accent focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                Reenviar email
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted">
              ¿Ya verificaste?{" "}
              <Link
                href="/login"
                className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
