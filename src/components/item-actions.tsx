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
      <div className="rounded-lg border border-border-accent bg-surface p-3">
        {editForm}
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-secondary hover:bg-surface-hover"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="min-w-0 flex-1">{view}</div>
      <div className="flex shrink-0 gap-1 opacity-60 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Editar"
          className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover hover:text-accent"
        >
          <Pencil className="h-4 w-4" />
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
            className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
