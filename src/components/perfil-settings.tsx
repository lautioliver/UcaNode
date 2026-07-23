"use client";

import { useActionState, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const THEME_COOKIE = "ucanode_theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function FormFeedback({
  state,
  pending,
  submitLabel = "Guardar",
}: {
  state: ActionResult;
  pending: boolean;
  submitLabel?: string;
}) {
  return (
    <>
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Guardando..." : submitLabel}
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

export function PerfilInfoForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    nombre: string;
    anioIngreso: number;
    legajo: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Información de perfil</CardTitle>
        <CardDescription>
          Datos personales visibles en la app. Para cambiarlos no hace falta verificar tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-accent-subtle text-lg font-semibold text-accent">
              {initials(defaultValues.nombre || "UN")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-primary">{defaultValues.nombre || "Estudiante"}</p>
            <p className="text-xs text-muted">Iniciales generadas automáticamente</p>
          </div>
        </div>

        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo" htmlFor="nombre">
            <Input
              id="nombre"
              name="nombre"
              required
              defaultValue={defaultValues.nombre}
              placeholder="Tu nombre completo"
            />
          </Field>
          <Field label="Año de ingreso" htmlFor="anioIngreso">
            <Input
              id="anioIngreso"
              name="anioIngreso"
              type="number"
              min={2000}
              max={2100}
              required
              defaultValue={defaultValues.anioIngreso}
            />
          </Field>
          <Field label="Legajo" htmlFor="legajo" span>
            <Input
              id="legajo"
              name="legajo"
              defaultValue={defaultValues.legajo ?? ""}
              placeholder="Ej: INF-0000 (opcional)"
            />
          </Field>
          <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
        </form>
      </CardContent>
    </Card>
  );
}

export function PerfilAcademicoCard({ carreraNombre }: { carreraNombre: string | null }) {
  return (
    <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Datos académicos</CardTitle>
        <CardDescription>
          La carrera se define durante el onboarding inicial y no puede cambiarse desde acá.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field label="Carrera">
          <Input
            value={carreraNombre ?? "Sin carrera asignada"}
            readOnly
            className="cursor-not-allowed bg-surface-subtle opacity-90"
          />
        </Field>
      </CardContent>
    </Card>
  );
}

export function PerfilSeguridadForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    emailUcasal: string;
    passwordConfigured: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Seguridad</CardTitle>
        <CardDescription>
          Para cambiar email o contraseña necesitás confirmar tu contraseña actual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Contraseña actual" htmlFor="currentPassword" span>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Ingresá tu contraseña actual"
            />
          </Field>
          <Field label="Email UCASAL" htmlFor="emailUcasal" span>
            <Input
              id="emailUcasal"
              name="emailUcasal"
              type="email"
              defaultValue={defaultValues.emailUcasal}
              placeholder="nombre.apellido@ucasal.edu.ar"
            />
          </Field>
          <Field
            label="Nueva contraseña"
            htmlFor="password"
            span
            hint={
              defaultValues.passwordConfigured
                ? "Dejá vacío si no querés cambiar la contraseña."
                : "Opcional si aún no configuraste una contraseña."
            }
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Nueva contraseña (opcional)"
            />
          </Field>
          <FormFeedback state={state} pending={pending} submitLabel="Actualizar seguridad" />
        </form>
      </CardContent>
    </Card>
  );
}

export function PerfilAparienciaCard({ initialDark }: { initialDark: boolean }) {
  return (
    <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Apariencia</CardTitle>
        <CardDescription>Personalizá cómo se ve UcaNode en tu dispositivo.</CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeSwitch initialDark={initialDark} />
      </CardContent>
    </Card>
  );
}

function ThemeSwitch({ initialDark }: { initialDark: boolean }) {
  const [dark, setDark] = useState(initialDark);

  function toggleTheme(checked: boolean) {
    setDark(checked);
    document.documentElement.classList.toggle("dark", checked);
    setCookie(THEME_COOKIE, checked ? "dark" : "light");
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-subtle px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-accent-ghost text-accent">
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </span>
        <div>
          <p className="text-sm font-medium text-primary">Modo oscuro</p>
          <p className="text-xs text-muted">Activá el tema oscuro en toda la aplicación.</p>
        </div>
      </div>
      <Switch checked={dark} onCheckedChange={toggleTheme} aria-label="Modo oscuro" />
    </div>
  );
}
