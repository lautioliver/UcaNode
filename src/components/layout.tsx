import Link from "next/link";
import { Calendar, ExternalLink, User } from "lucide-react";

const navItems = [
  { href: "/horarios", label: "1", title: "Horarios personalizados" },
  { href: "/links", label: "2", title: "Links externos" },
];

export function AppHeader({ perfilNombre }: { perfilNombre?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-card px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-secondary">Navegación</span>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-ghost text-sm font-semibold text-accent transition hover:bg-accent-subtle"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/perfil"
        className="flex items-center gap-2 rounded-lg border border-border bg-surface-card px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface-hover"
      >
        <User className="h-4 w-4 text-accent" />
        {perfilNombre ?? "Usuario Ucasal"}
      </Link>
    </header>
  );
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[280px] flex-col rounded-xl border border-border bg-surface-card p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-primary">{title}</h2>
        {action}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      {message}
    </p>
  );
}

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}

export function CalendarSectionTitle() {
  return (
    <div className="mb-3 flex items-center gap-2 text-base font-semibold text-primary">
      <Calendar className="h-5 w-5 text-accent" />
      Calendario
    </div>
  );
}
