"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Drawer } from "@/components/drawer";
import { EntregaCreateForm } from "@/components/forms";
import { createEntrega } from "@/lib/actions";

export function EntregaFab({
  materias,
}: {
  materias: { id: string; nombre: string }[];
}) {
  const [open, setOpen] = useState(false);
  // true recién en el cliente: evita renderizar el portal durante SSR/hidratación
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Agregar entrega"
        className="group/fab fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_20px_rgb(37_99_235_/_0.45)] transition hover:scale-105 hover:bg-accent-hover active:scale-95 sm:bottom-8 sm:right-8"
      >
        <Plus className="h-6 w-6" />
        <span className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-surface opacity-0 shadow-[var(--shadow-md)] transition-opacity group-hover/fab:opacity-100">
          Agregar entrega
        </span>
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        subtitle="Nueva entrega"
        title="Agregar entrega"
      >
        {materias.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-ghost text-accent">
              <BookOpen className="h-6 w-6" />
            </span>
            <p className="max-w-xs text-sm text-secondary">
              Agregá al menos una materia a tu perfil para poder registrar entregas.
            </p>
            <Link
              href="/materias"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Ir a materias
            </Link>
          </div>
        ) : (
          <EntregaCreateForm
            action={createEntrega}
            materias={materias}
            onSuccess={() => setOpen(false)}
            compact
          />
        )}
      </Drawer>
    </>,
    document.body,
  );
}
