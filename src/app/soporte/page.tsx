import type { Metadata } from "next";
import { getPerfilConCarrera, displayEmailUcasal } from "@/lib/perfil";
import { PageHeader } from "@/components/layout";
import { SoporteForm } from "@/components/soporte-form";
import { submitSupportMessage } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Soporte — UcaNode",
};

export default async function SoportePage() {
  const perfil = await getPerfilConCarrera();
  const email = displayEmailUcasal(perfil?.emailUcasal);

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        pill="Ayuda"
        title="Soporte"
        description="Reportá bugs, hacé consultas o sugerí mejoras. Te responderemos por email."
      />

      {email ? (
        <SoporteForm
          action={submitSupportMessage}
          defaultValues={{
            email,
            nombre: perfil?.nombre ?? "Estudiante",
            carrera: perfil?.carrera?.nombre ?? null,
          }}
        />
      ) : (
        <p className="rounded-2xl border border-border bg-surface-card p-6 text-sm text-secondary">
          Para contactar soporte necesitás tener un email UCASAL configurado en tu{" "}
          <a href="/perfil" className="text-accent underline-offset-2 hover:underline">
            perfil
          </a>
          .
        </p>
      )}
    </main>
  );
}
