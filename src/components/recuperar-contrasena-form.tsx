"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecuperarContrasenaForm({
  action,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-secondary">
          Email UCASAL
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nombre.apellido@ucasal.edu.ar"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Enviar enlace"}
      </Button>

      {state.message ? (
        <p
          className={`text-sm ${state.success ? "text-success" : "text-danger"}`}
        >
          {state.message}
        </p>
      ) : null}

      <p className="text-center text-xs text-muted">
        <Link
          href="/login"
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  );
}
