"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActionResult } from "@/lib/actions";

type ItemActionsProps = {
  label: string;
  view: React.ReactNode;
  editForm: React.ReactNode;
  deleteAction: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  deleteId: string;
  modalTitle?: string;
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
  modalTitle,
}: ItemActionsProps) {
  const [editing, setEditing] = useState(false);
  const modal = Boolean(modalTitle);

  useEffect(() => {
    if (!modal) return;
    document.body.style.overflow = editing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editing, modal]);

  if (editing && !modal) {
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
    <>
      <div className="group relative">
        {view}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-border bg-surface-card/95 p-1 opacity-0 shadow-[var(--shadow-card)] backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto">
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Editar"
            aria-label={`Editar ${label}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-secondary transition hover:bg-accent-ghost hover:text-accent"
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
              aria-label={`Eliminar ${label}`}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-secondary transition hover:bg-danger-ghost hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {modal && editing && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setEditing(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface-card p-6 shadow-[var(--shadow-card-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  Editar
                </p>
                <h3 className="text-base font-semibold text-primary">
                  {modalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {editForm}
          </div>
        </div>
      )}
    </>
  );
}
