import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/layout";
import { PerfilForm } from "@/components/forms";
import { updatePerfil } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Perfil — UcaNode",
};

export default async function PerfilPage() {
  const perfil = await prisma.perfil.findFirst();

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-card px-5 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Usuario Ucasal</h1>
          <p className="text-sm text-muted">
            Tu perfil de estudiante de Ingeniería Informática.
          </p>
        </div>
      </header>

      <SectionCard title="Datos personales">
        <PerfilForm
          action={updatePerfil}
          defaultValues={{
            nombre: perfil?.nombre ?? "",
            emailUcasal: perfil?.emailUcasal ?? "",
            carrera: perfil?.carrera ?? "Ingeniería Informática",
            anioIngreso: perfil?.anioIngreso ?? new Date().getFullYear(),
            legajo: perfil?.legajo ?? null,
          }}
        />
      </SectionCard>
    </main>
  );
}
