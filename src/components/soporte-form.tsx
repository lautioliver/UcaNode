"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function FormFeedback({
  state,
  pending,
  submitLabel = "Enviar mensaje",
}: {
  state: ActionResult;
  pending: boolean;
  submitLabel?: string;
}) {
  return (
    <>
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Enviando..." : submitLabel}
      </Button>
      {state.message && (
        <p
          className={`text-sm sm:col-span-2 ${state.success ? "text-success" : "text-danger"}`}
        >
          {state.message}
        </p>
      )}
      {state.errors && (
        <ul className="text-sm text-danger sm:col-span-2">
          {Object.entries(state.errors).map(([field, msgs]) =>
            msgs.map((msg, i) => (
              <li key={`${field}-${i}`}>
                {field}: {msg}
              </li>
            )),
          )}
        </ul>
      )}
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
  span,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  span?: boolean;
  hint?: string;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <Label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-secondary">
        {label}
      </Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

const selectClass = cn(
  "flex h-9 w-full rounded-md border border-input bg-surface-card px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 focus-visible:border-accent",
);

export function SoporteForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    email: string;
    nombre: string;
    carrera: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Enviar mensaje</CardTitle>
        <CardDescription>
          Reportá bugs, hacé consultas o sugerí mejoras. Te responderemos a{" "}
          <span className="font-medium text-secondary">{defaultValues.email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="nombre-display">
            <Input
              id="nombre-display"
              value={defaultValues.nombre}
              readOnly
              className="cursor-not-allowed bg-surface-subtle opacity-90"
            />
          </Field>
          <Field label="Email UCASAL" htmlFor="email-display">
            <Input
              id="email-display"
              value={defaultValues.email}
              readOnly
              className="cursor-not-allowed bg-surface-subtle opacity-90"
            />
          </Field>
          {defaultValues.carrera && (
            <Field label="Carrera" htmlFor="carrera-display" span>
              <Input
                id="carrera-display"
                value={defaultValues.carrera}
                readOnly
                className="cursor-not-allowed bg-surface-subtle opacity-90"
              />
            </Field>
          )}
          <Field label="Categoría" htmlFor="categoria">
            <select id="categoria" name="categoria" className={selectClass} defaultValue="">
              <option value="">Sin categoría</option>
              <option value="BUG">Bug</option>
              <option value="CONSULTA">Consulta</option>
              <option value="SUGERENCIA">Sugerencia</option>
            </select>
          </Field>
          <Field label="Asunto" htmlFor="asunto" span>
            <Input
              id="asunto"
              name="asunto"
              required
              maxLength={120}
              placeholder="Ej: No puedo ver mis entregas"
            />
          </Field>
          <Field
            label="Mensaje"
            htmlFor="mensaje"
            span
            hint="Máximo 2000 caracteres."
          >
            <Textarea
              id="mensaje"
              name="mensaje"
              required
              maxLength={2000}
              rows={6}
              placeholder="Contanos qué pasó o en qué podemos ayudarte..."
            />
          </Field>
          <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <FormFeedback state={state} pending={pending} />
        </form>
      </CardContent>
    </Card>
  );
}
