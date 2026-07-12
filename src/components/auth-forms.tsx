"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions";
import { login, registro } from "@/lib/auth-actions";

const input =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-accent focus:ring-2 focus:ring-accent/40";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
      {error?.[0] && <p className="text-xs text-danger">{error[0]}</p>}
    </label>
  );
}

function AuthFeedback({
  state,
  pending,
  submitLabel,
}: {
  state: ActionResult;
  pending: boolean;
  submitLabel: string;
}) {
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Procesando..." : submitLabel}
      </button>
      {state.message && !state.success && (
        <p className="text-center text-sm text-danger">{state.message}</p>
      )}
    </>
  );
}

function guestHref(next?: string) {
  return next ? `/api/session?next=${encodeURIComponent(next)}` : "/api/session?next=/";
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, { success: true });

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email" error={state.errors?.email}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className={input}
        />
      </Field>
      <Field label="Contraseña" error={state.errors?.password}>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Tu contraseña"
          className={input}
        />
      </Field>
      <AuthFeedback state={state} pending={pending} submitLabel="Iniciar sesión" />
      <p className="text-center text-xs text-muted">
        ¿No tenés cuenta?{" "}
        <Link
          href={next ? `/registro?next=${encodeURIComponent(next)}` : "/registro"}
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
        >
          Crear una
        </Link>
      </p>
    </form>
  );
}

export function RegistroForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(registro, { success: true });

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Nombre" error={state.errors?.nombre}>
        <input
          name="nombre"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          className={input}
        />
      </Field>
      <Field label="Email" error={state.errors?.email}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className={input}
        />
      </Field>
      <Field label="Contraseña" error={state.errors?.password}>
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          className={input}
        />
      </Field>
      <Field label="Confirmar contraseña" error={state.errors?.confirmPassword}>
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repetí la contraseña"
          className={input}
        />
      </Field>
      <AuthFeedback state={state} pending={pending} submitLabel="Crear cuenta" />
      <p className="text-center text-xs text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}

export { guestHref };
