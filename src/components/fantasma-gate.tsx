import Link from "next/link";
import { Ghost } from "lucide-react";
import { LogoMark } from "@/components/logo";

export function FantasmaGate({ next }: { next?: string }) {
  const registroHref = next
    ? `/registro?next=${encodeURIComponent(next)}`
    : "/registro";
  const loginHref = next
    ? `/login?next=${encodeURIComponent(next)}`
    : "/login";

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <LogoMark className="h-9 w-9" />
          <span className="text-sm font-semibold text-primary">UcaNode</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Ghost className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            Creá tu cuenta para continuar
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Tenés datos guardados en este dispositivo. Para seguir usando UcaNode
            necesitás una cuenta con email verificado. Al registrarte conservás
            materias, entregas y horarios.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href={registroHref}
              className="flex flex-1 items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Crear cuenta
            </Link>
            <Link
              href={loginHref}
              className="flex flex-1 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-surface-hover"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
