"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TermsAcceptanceField } from "@/components/terms-acceptance-field";
import {
  readLoginDraft,
  readRegistroDraft,
  writeLoginDraft,
  writeRegistroDraft,
} from "@/lib/auth-form-draft";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const draft = readLoginDraft();
    if (!draft) return;
    setEmail(draft.email);
    setPassword(draft.password ?? "");
    setAcceptTerms(draft.acceptTerms);
  }, []);

  function persistDraft(nextEmail: string, nextPassword: string, nextAcceptTerms: boolean) {
    writeLoginDraft({ email: nextEmail, password: nextPassword, acceptTerms: nextAcceptTerms });
  }

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
          value={email}
          onChange={(event) => {
            const nextEmail = event.target.value;
            setEmail(nextEmail);
            persistDraft(nextEmail, password, acceptTerms);
          }}
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
          value={password}
          onChange={(event) => {
            const nextPassword = event.target.value;
            setPassword(nextPassword);
            persistDraft(email, nextPassword, acceptTerms);
          }}
        />
      </Field>
      <TermsAcceptanceField
        checked={acceptTerms}
        onCheckedChange={(checked) => {
          setAcceptTerms(checked);
          persistDraft(email, password, checked);
        }}
      />
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
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const draft = readRegistroDraft();
    if (!draft) return;
    setNombre(draft.nombre);
    setEmail(draft.email);
    setPassword(draft.password ?? "");
    setConfirmPassword(draft.confirmPassword ?? "");
    setAcceptTerms(draft.acceptTerms);
  }, []);

  function persistDraft(
    nextNombre: string,
    nextEmail: string,
    nextPassword: string,
    nextConfirmPassword: string,
    nextAcceptTerms: boolean,
  ) {
    writeRegistroDraft({
      nombre: nextNombre,
      email: nextEmail,
      password: nextPassword,
      confirmPassword: nextConfirmPassword,
      acceptTerms: nextAcceptTerms,
    });
  }

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
          value={nombre}
          onChange={(event) => {
            const nextNombre = event.target.value;
            setNombre(nextNombre);
            persistDraft(nextNombre, email, password, confirmPassword, acceptTerms);
          }}
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
          value={email}
          onChange={(event) => {
            const nextEmail = event.target.value;
            setEmail(nextEmail);
            persistDraft(nombre, nextEmail, password, confirmPassword, acceptTerms);
          }}
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
          value={password}
          onChange={(event) => {
            const nextPassword = event.target.value;
            setPassword(nextPassword);
            persistDraft(nombre, email, nextPassword, confirmPassword, acceptTerms);
          }}
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
          value={confirmPassword}
          onChange={(event) => {
            const nextConfirmPassword = event.target.value;
            setConfirmPassword(nextConfirmPassword);
            persistDraft(nombre, email, password, nextConfirmPassword, acceptTerms);
          }}
        />
      </Field>
      <TermsAcceptanceField
        required
        checked={acceptTerms}
        onCheckedChange={(checked) => {
          setAcceptTerms(checked);
          persistDraft(nombre, email, password, confirmPassword, checked);
        }}
      />
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
