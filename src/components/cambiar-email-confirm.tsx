"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function CambiarEmailConfirm({
  token,
  currentEmail,
  newEmail,
  action,
}: {
  token: string;
  currentEmail: string;
  newEmail: string;
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm">
        <p className="text-secondary">
          Email actual:{" "}
          <span className="font-medium text-primary">{currentEmail}</span>
        </p>
        <p className="mt-1 text-secondary">
          Email nuevo:{" "}
          <span className="font-medium text-primary">{newEmail}</span>
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Confirmando..." : "Confirmar cambio de email"}
        </Button>
        {state.message ? (
          <p
            className={`text-sm ${state.success ? "text-success" : "text-danger"}`}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
