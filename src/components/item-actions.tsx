"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  if (editing && !modal) {
    return (
      <div className="rounded-2xl border border-border-accent bg-surface-card p-5 shadow-[var(--shadow-card)]">
        {editForm}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(false)}
          className="mt-3"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="group relative">
        {view}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-border bg-surface-card/95 p-1 opacity-0 shadow-[var(--shadow-card)] backdrop-blur transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditing(true)}
            title="Editar"
            aria-label={`Editar ${label}`}
            className="rounded-full hover:bg-accent-ghost hover:text-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <form
            action={wrapDelete(deleteAction)}
            onSubmit={(e) => {
              if (!confirm(`¿Eliminar ${label}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={deleteId} />
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              title="Eliminar"
              aria-label={`Eliminar ${label}`}
              className="rounded-full hover:bg-danger-ghost hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {modal && (
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogDescription className="text-[11px] font-medium uppercase tracking-wider">
                Editar
              </DialogDescription>
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>
            {editForm}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
