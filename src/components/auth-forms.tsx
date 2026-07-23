"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-secondary">
        {label}
      </Label>
      {children}
    </div>
  );
}


export function LoginForm({
  next,
  error,
}: {
  next?: string;
  error?: string;
}) {
  return (
    <form action="/api/auth/login" method="POST" className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email" htmlFor="login-email">
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />
      </Field>
      <Field label="Contraseña" htmlFor="login-password">
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Tu contraseña"
        />
      </Field>
      <Button type="submit" className="w-full">
        Iniciar sesión
      </Button>
      {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
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

export function RegistroForm({
  next,
  error,
}: {
  next?: string;
  error?: string;
}) {
  return (
    <form action="/api/auth/registro" method="POST" className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Nombre" htmlFor="registro-nombre">
        <Input
          id="registro-nombre"
          name="nombre"
          required
          autoComplete="name"
          placeholder="Tu nombre"
        />
      </Field>
      <Field label="Email" htmlFor="registro-email">
        <Input
          id="registro-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />
      </Field>
      <Field label="Contraseña" htmlFor="registro-password">
        <Input
          id="registro-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />
      </Field>
      <Field label="Confirmar contraseña" htmlFor="registro-confirm">
        <Input
          id="registro-confirm"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repetí la contraseña"
        />
      </Field>
      <Button type="submit" className="w-full">
        Crear cuenta
      </Button>
      {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
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

