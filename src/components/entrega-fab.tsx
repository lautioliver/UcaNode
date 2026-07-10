"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/drawer";
import { EntregaCreateForm } from "@/components/forms";
import { createEntrega } from "@/lib/actions";

export function EntregaFab({
  materias,
}: {
  materias: { id: string; nombre: string }[];
}) {
  const [open, setOpen] = useState(false);

  if (materias.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Agregar entrega"
        className="group/fab fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_20px_rgb(37_99_235_/_0.45)] transition hover:scale-105 hover:bg-accent-hover active:scale-95 sm:bottom-8 sm:right-8"
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
        <EntregaCreateForm
          action={createEntrega}
          materias={materias}
          onSuccess={() => setOpen(false)}
          compact
        />
      </Drawer>
    </>
  );
}
