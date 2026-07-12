import type { Metadata } from "next";
import { RegistroForm, guestHref } from "@/components/auth-forms";
import { AuthPageShell } from "@/components/auth-shell";
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
    <AuthPageShell
      title="Crear cuenta"
      description="Guardá tu progreso para acceder desde cualquier dispositivo."
      guestCta="Probar primero sin cuenta"
      guestHref={guestHref(safeNext)}
    >
      <RegistroForm next={safeNext} error={error} />
    </AuthPageShell>
  );
}
