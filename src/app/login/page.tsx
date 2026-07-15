import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { AuthPageShell } from "@/components/auth-shell";
import { CarrerasDisponibles } from "@/components/carreras-disponibles";
import { safeAuthRedirect } from "@/lib/auth";
import { listCarrerasDisponibles } from "@/lib/planes-estudio/catalogo";

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
      description="Accedé a tu espacio con email y contraseña."
    >
      <LoginForm next={safeNext} error={error} />
      <CarrerasDisponibles carreras={listCarrerasDisponibles()} className="mt-6" />
    </AuthPageShell>
  );
}
