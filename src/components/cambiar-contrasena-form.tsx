"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions";
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

function FormFeedback({
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
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : submitLabel}
      </Button>
      {state.message ? (
        <p
          className={`text-sm ${state.success ? "text-success" : "text-danger"}`}
        >
          {state.message}
        </p>
      ) : null}
      {state.errors ? (
        <ul className="space-y-1 text-sm text-danger">
          {Object.values(state.errors).flat().map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function CambiarContrasenaForm({
  token,
  action,
}: {
  token: string;
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label="Nueva contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />
      </Field>
      <Field label="Confirmar contraseña" htmlFor="confirmPassword">
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repetí la contraseña"
        />
      </Field>
      <FormFeedback
        state={state}
        pending={pending}
        submitLabel="Actualizar contraseña"
      />
    </form>
  );
}
