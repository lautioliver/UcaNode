import type { Metadata } from "next";
import { User } from "lucide-react";
import { getPerfilConCarrera, displayEmailUcasal } from "@/lib/perfil";
import { Card, PageHeader } from "@/components/layout";
import { PerfilForm } from "@/components/forms";
import { updatePerfil } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Perfil — UcaNode",
};

export default async function PerfilPage() {
  const perfil = await getPerfilConCarrera();

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        pill="Datos personales"
        title="¿Quién sos en Ucasal?"
        description="Estos datos se usan para saludarte y prellenar formularios cuando corresponda."
      />

      <Card className="space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-ghost text-accent">
            <User className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-primary">
              {perfil?.nombre ?? "Estudiante"}
            </p>
            <p className="truncate text-sm text-muted">
              {displayEmailUcasal(perfil?.emailUcasal) || "Agregá tu email"}
            </p>
            {perfil?.carrera && (
              <p className="mt-0.5 text-xs text-secondary">{perfil.carrera.nombre}</p>
            )}
          </div>
        </div>

        <PerfilForm
          action={updatePerfil}
          defaultValues={{
            nombre: perfil?.nombre ?? "",
            emailUcasal: displayEmailUcasal(perfil?.emailUcasal),
            carreraNombre: perfil?.carrera?.nombre ?? null,
            anioIngreso: perfil?.anioIngreso ?? new Date().getFullYear(),
            legajo: perfil?.legajo ?? null,
            passwordConfigured: Boolean(perfil?.password),
          }}
        />
      </Card>
    </main>
  );
}
