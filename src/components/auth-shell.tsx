import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthPageShell({
  title,
  description,
  children,
  guestCta,
  guestHref = "/api/session?next=/",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  guestCta?: string;
  guestHref?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <Link
          href={guestHref}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Elegir carrera
        </Link>

        <div className="flex flex-1 flex-col justify-center space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-secondary">{description}</p>
          </div>

          <Link
            href={guestHref}
            className="flex w-full items-center justify-center rounded-lg border border-border bg-surface-card px-4 py-2.5 text-sm font-medium text-primary transition hover:border-border-strong hover:bg-surface-hover"
          >
            {guestCta ?? "Continuar sin cuenta"}
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
              o con tu cuenta
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
