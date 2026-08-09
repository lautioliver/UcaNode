import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getPerfilConCarrera, displayEmailUcasal } from "@/lib/perfil";
import { PageHeader } from "@/components/layout";
import {
  PerfilAcademicoCard,
  PerfilAparienciaCard,
  PerfilInfoForm,
  PerfilSeguridadForm,
} from "@/components/perfil-settings";
import {
  updatePerfil,
  requestPasswordChange,
  requestEmailChange,
} from "@/lib/actions";

export const metadata: Metadata = {
  title: "Perfil — UcaNode",
};

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const dark = cookieStore.get("ucanode_theme")?.value !== "light";
  const perfil = await getPerfilConCarrera();

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        pill="Configuración"
        title="Perfil y preferencias"
        description="Administrá tu información personal, datos de seguridad y apariencia de UcaNode."
      />

      <div className="space-y-6">
        <PerfilInfoForm
          action={updatePerfil}
          defaultValues={{
            nombre: perfil?.nombre ?? "",
            anioIngreso: perfil?.anioIngreso ?? new Date().getFullYear(),
            legajo: perfil?.legajo ?? null,
          }}
        />

        <PerfilAcademicoCard carreraNombre={perfil?.carrera?.nombre ?? null} />

        <PerfilSeguridadForm
          passwordAction={requestPasswordChange}
          emailAction={requestEmailChange}
          defaultValues={{
            emailUcasal: displayEmailUcasal(perfil?.emailUcasal),
            emailVerified: Boolean(perfil?.emailVerifiedAt),
          }}
        />

        <PerfilAparienciaCard initialDark={dark} />
      </div>
    </main>
  );
}
