import type { Metadata } from "next";
import { RegistroForm } from "@/components/auth-forms";
import { AuthScene } from "@/components/auth-scene";
import { safeAuthRedirect } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Crear cuenta — UcaNode",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next ? safeAuthRedirect(next) : undefined;

  return (
    <AuthScene
      title="Crear cuenta"
      description="Guardá tu progreso para acceder desde cualquier dispositivo."
      hint="Después del registro vas a elegir tu carrera en el onboarding."
    >
      <RegistroForm next={safeNext} error={error} />
    </AuthScene>
  );
}
