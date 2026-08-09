import type { Metadata } from "next";
import Link from "next/link";
import { AuthScene } from "@/components/auth-scene";
import { CambiarEmailConfirm } from "@/components/cambiar-email-confirm";
import { applyEmailChange } from "@/lib/actions";
import { peekSecurityToken } from "@/lib/security-action";
import { SecurityActionType } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Confirmar cambio de email — UcaNode",
};

export default async function CambiarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthScene
        title="Enlace inválido"
        description="El enlace para confirmar el cambio de email no es válido."
      >
        <p className="text-center text-sm text-secondary">
          <Link href="/perfil" className="underline underline-offset-2">
            Volver a configuración
          </Link>
        </p>
      </AuthScene>
    );
  }

  const result = await peekSecurityToken(token, SecurityActionType.EMAIL_CHANGE);

  if (!result.ok || !result.payload?.newEmail || !result.emailUcasal) {
    const message =
      result.ok === false && result.reason === "expired"
        ? "El enlace expiró. Solicitá un cambio de email nuevamente."
        : "El enlace no es válido.";

    return (
      <AuthScene title="Enlace inválido" description={message}>
        <p className="text-center text-sm text-secondary">
          <Link href="/perfil" className="underline underline-offset-2">
            Volver a configuración
          </Link>
        </p>
      </AuthScene>
    );
  }

  return (
    <AuthScene
      title="Confirmar cambio de email"
      description={`Hola ${result.nombre}, revisá el cambio antes de confirmarlo.`}
    >
      <CambiarEmailConfirm
        token={token}
        currentEmail={result.emailUcasal}
        newEmail={result.payload.newEmail}
        action={applyEmailChange}
      />
    </AuthScene>
  );
}
