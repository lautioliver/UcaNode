import type { Metadata } from "next";
import { AuthScene } from "@/components/auth-scene";
import { RecuperarContrasenaForm } from "@/components/recuperar-contrasena-form";
import { requestPasswordReset } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Recuperar contraseña — UcaNode",
};

export default function RecuperarContrasenaPage() {
  return (
    <AuthScene
      title="Recuperar contraseña"
      description="Te enviaremos un enlace a tu email UCASAL para elegir una contraseña nueva."
    >
      <RecuperarContrasenaForm action={requestPasswordReset} />
    </AuthScene>
  );
}
