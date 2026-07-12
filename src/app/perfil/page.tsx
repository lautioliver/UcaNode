import type { Metadata } from "next";
import Link from "next/link";
import { User } from "lucide-react";
import { isPerfilRegistrado } from "@/lib/auth";
import { getPerfilConCarrera, displayEmailUcasal } from "@/lib/perfil";
import { Card, PageHeader } from "@/components/layout";
import { PerfilForm } from "@/components/forms";
import { updatePerfil } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Perfil — UcaNode",
};

export default async function PerfilPage() {
  const perfil = await getPerfilConCarrera();
  const cuentaRegistrada = isPerfilRegistrado(perfil);

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        pill="Datos personales"
        title="¿Quién sos en Ucasal?"
        description="Estos datos se usan para saludarte y prellenar formularios cuando corresponda."
      />

      {!cuentaRegistrada && (
        <Card className="space-y-4 border-dashed">
          <div>
            <p className="text-sm font-medium text-primary">Guardá tu cuenta</p>
            <p className="mt-1 text-sm text-secondary">
              Creá una cuenta para acceder a tu espacio desde cualquier navegador o dispositivo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface-hover"
            >
              Iniciar sesión
            </Link>
          </div>
        </Card>
      )}

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
