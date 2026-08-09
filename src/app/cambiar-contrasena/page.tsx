import type { Metadata } from "next";
import Link from "next/link";
import { AuthScene } from "@/components/auth-scene";
import { CambiarContrasenaForm } from "@/components/cambiar-contrasena-form";
import { applyPasswordChange } from "@/lib/actions";
import { peekSecurityToken } from "@/lib/security-action";
import { SecurityActionType } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Cambiar contraseña — UcaNode",
};

export default async function CambiarContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthScene
        title="Enlace inválido"
        description="El enlace para cambiar la contraseña no es válido."
      >
        <p className="text-center text-sm text-secondary">
          <Link href="/recuperar-contrasena" className="underline underline-offset-2">
            Solicitar un enlace nuevo
          </Link>
        </p>
      </AuthScene>
    );
  }

  const result = await peekSecurityToken(token, SecurityActionType.PASSWORD_CHANGE);

  if (!result.ok) {
    const message =
      result.reason === "expired"
        ? "El enlace expiró. Solicitá uno nuevo."
        : "El enlace no es válido.";

    return (
      <AuthScene title="Enlace inválido" description={message}>
        <p className="text-center text-sm text-secondary">
          <Link href="/recuperar-contrasena" className="underline underline-offset-2">
            Solicitar un enlace nuevo
          </Link>
        </p>
      </AuthScene>
    );
  }

  return (
    <AuthScene
      title="Nueva contraseña"
      description={`Hola ${result.nombre}, elegí una contraseña nueva para tu cuenta.`}
    >
      <CambiarContrasenaForm token={token} action={applyPasswordChange} />
    </AuthScene>
  );
}
