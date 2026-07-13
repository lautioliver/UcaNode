import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/materias", label: "Materias" },
  { href: "/entregas", label: "Entregas" },
  { href: "/analytics", label: "Analíticas" },
  { href: "/horarios", label: "Horarios" },
  { href: "/links", label: "Links" },
  { href: "/perfil", label: "Perfil" },
] as const;

const EXTERNAL_LINKS = [
  {
    href: "https://campus.ucasal.edu.ar",
    label: "Campus Ucasal",
  },
  {
    href: "https://www.ucasal.edu.ar",
    label: "Sitio Ucasal",
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface-subtle">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/dashboard" className="inline-block">
              <span className="block text-[15px] font-semibold leading-tight text-primary">
                UcaNode
              </span>
              <span className="block text-[11px] leading-tight text-muted">
                Ing. Informática · Ucasal
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-secondary">
              Autogestión académica para organizar materias, entregas, horarios
              y recursos en un solo lugar.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Navegación
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Recursos
            </p>
            <ul className="space-y-2">
              {EXTERNAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
                  >
                    {label}
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/links"
                  className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                >
                  Links guardados
                  <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Proyecto
            </p>
            <ul className="space-y-2 text-sm text-secondary">
              <li>SQLite local · sin sincronización externa</li>
              <li>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  En desarrollo activo
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {year} UcaNode. Herramienta personal para estudiantes de la Ucasal.
          </p>
          <p className="inline-flex items-center gap-2 text-xs text-muted">
            <span className="font-mono text-[10px] tracking-wide text-secondary">
              v0.1
            </span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            Hecho con Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
