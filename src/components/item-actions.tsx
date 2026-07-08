"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { ActionResult } from "@/lib/actions";

type ItemActionsProps = {
  label: string;
  view: React.ReactNode;
  editForm: React.ReactNode;
  deleteAction: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  deleteId: string;
};

function wrapDelete(
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>,
) {
  return async (formData: FormData) => {
    await action({ success: true }, formData);
  };
}

export function ItemActions({
  label,
  view,
  editForm,
  deleteAction,
  deleteId,
}: ItemActionsProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-2xl border border-border-accent bg-surface-card p-5 shadow-[var(--shadow-card)]">
        {editForm}
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-secondary transition hover:bg-surface-hover"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="group relative">
      {view}
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Editar"
          className="rounded-lg border border-border bg-surface-card/95 p-1.5 text-secondary shadow-[var(--shadow-card)] backdrop-blur transition hover:text-accent"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <form
          action={wrapDelete(deleteAction)}
          onSubmit={(e) => {
            if (!confirm(`¿Eliminar ${label}?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={deleteId} />
          <button
            type="submit"
            title="Eliminar"
            className="rounded-lg border border-border bg-surface-card/95 p-1.5 text-secondary shadow-[var(--shadow-card)] backdrop-blur transition hover:border-[color:var(--danger)]/40 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
