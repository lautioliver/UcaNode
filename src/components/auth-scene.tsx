import { ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { FloatingCarreras } from "@/components/floating-carreras";
import { Card, CardContent } from "@/components/ui/card";
import {
  CARRERA_SOLICITUD_FORM_URL,
  carreraSolicitudFormDisponible,
} from "@/lib/planes-estudio/solicitud-carrera";
import type { CarreraCatalogo } from "@/lib/planes-estudio/types";

export function AuthScene({
  title,
  description,
  hint,
  carreras,
  children,
}: {
  title: string;
  description: string;
  hint?: string;
  carreras?: CarreraCatalogo[];
  children: React.ReactNode;
}) {
  const resolvedHint =
    hint ??
    (carreras
      ? `${carreras.length} carreras con plan de estudios cargado en UcaNode`
      : undefined);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <main className="relative flex min-h-[28rem] flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
        {carreras && carreras.length > 0 && <FloatingCarreras carreras={carreras} />}

        <div className="relative z-10 isolate w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex flex-col items-center gap-2">
              <LogoMark className="h-12 w-12 shrink-0" />
              <div>
                <p className="text-base font-semibold text-primary">UcaNode</p>
                <p className="text-xs text-muted">Autogestión Ucasal</p>
              </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-secondary">{description}</p>
            {resolvedHint && (
              <p className="mt-3 text-xs text-muted">{resolvedHint}</p>
            )}
          </div>

          <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card-lg)]">
            <CardContent className="p-5 sm:p-6">{children}</CardContent>
          </Card>
        </div>
      </main>

      {carreraSolicitudFormDisponible() && (
        <footer className="relative z-20 shrink-0 border-t border-border bg-surface/90 px-4 py-5 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted">¿Tu carrera no aparece en la lista?</p>
            <a
              href={CARRERA_SOLICITUD_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Pedila acá
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

/** @deprecated Usar AuthScene */
export function LoginAuthScene({
  title,
  description,
  carreras,
  children,
}: {
  title: string;
  description: string;
  carreras: CarreraCatalogo[];
  children: React.ReactNode;
}) {
  return (
    <AuthScene title={title} description={description} carreras={carreras}>
      {children}
    </AuthScene>
  );
}
