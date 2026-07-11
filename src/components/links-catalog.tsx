"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  ExternalLink,
  HardDrive,
  Link2,
  Plus,
  School,
  Star,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ActionResult } from "@/lib/actions";
import { LinkCreateForm, LinkEditForm } from "@/components/forms";
import { ItemActions } from "@/components/item-actions";
import { EmptyState } from "@/components/layout";
import { categoriaLinkLabel } from "@/lib/labels";
import type { CategoriaLink } from "@/generated/prisma/client";

type LinkItem = {
  id: string;
  nombre: string;
  url: string;
  categoria: CategoriaLink;
  favorito: boolean;
};

const categoriaIcon: Record<CategoriaLink, ComponentType<{ className?: string }>> = {
  GOOGLE_DRIVE: HardDrive,
  PLATAFORMA_UCASAL: School,
  GITHUB: Code2,
  OTRO: Link2,
};

function CreateLinkModal({
  open,
  onClose,
  createLink,
}: {
  open: boolean;
  onClose: () => void;
  createLink: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface-card p-6 shadow-[var(--shadow-card-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Nuevo link
            </p>
            <h3 className="text-base font-semibold text-primary">
              Agregar al catálogo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-surface-hover"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <LinkCreateForm action={createLink} onSuccess={onClose} />
      </div>
    </div>
  );
}

export function LinksCatalog({
  links,
  emptyMessage,
  createLink,
  updateLink,
  deleteLink,
}: {
  links: LinkItem[];
  emptyMessage: string;
  createLink: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  updateLink: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  deleteLink: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  const addCard = (
    <button
      type="button"
      onClick={() => setCreateOpen(true)}
      className="flex min-h-[108px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-secondary"
    >
      <Plus className="h-4 w-4" />
      Nuevo link
    </button>
  );

  if (links.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <EmptyState message={emptyMessage} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addCard}
          </div>
        </div>
        <CreateLinkModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          createLink={createLink}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const Icon = categoriaIcon[link.categoria];
          return (
            <ItemActions
              key={link.id}
              label={link.nombre}
              modalTitle={link.nombre}
              deleteAction={deleteLink}
              deleteId={link.id}
              view={
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block min-h-[108px] rounded-lg border bg-surface-card p-4 pb-10 transition hover:border-border-strong hover:bg-surface-hover ${
                    link.favorito ? "border-[color:var(--warning)]/40" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug text-primary">
                          {link.nombre}
                        </p>
                        <p className="mt-1 text-[11px] text-muted">
                          {categoriaLinkLabel[link.categoria]}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {link.favorito && (
                        <Star className="h-4 w-4 fill-warning text-warning" />
                      )}
                      <ExternalLink className="h-4 w-4 text-muted group-hover:text-accent" />
                    </div>
                  </div>
                </a>
              }
              editForm={
                <LinkEditForm
                  action={updateLink}
                  defaultValues={{
                    id: link.id,
                    nombre: link.nombre,
                    url: link.url,
                    categoria: link.categoria,
                    favorito: link.favorito,
                  }}
                />
              }
            />
          );
        })}
        {addCard}
      </div>

      <CreateLinkModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        createLink={createLink}
      />
    </>
  );
}
