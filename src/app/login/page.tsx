import type { Metadata } from "next";
import { LoginForm, guestHref } from "@/components/auth-forms";
import { AuthPageShell } from "@/components/auth-shell";
import { safeAuthRedirect } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión — UcaNode",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next ? safeAuthRedirect(next) : undefined;

  return (
    <AuthPageShell
      title="Iniciar sesión"
      description="Recuperá tu espacio si ya creaste una cuenta."
      guestCta="Elegir carrera sin cuenta"
      guestHref={guestHref(safeNext)}
    >
      <LoginForm next={safeNext} error={error} />
    </AuthPageShell>
  );
}
