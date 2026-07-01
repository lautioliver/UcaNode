import Link from "next/link";
import { Calendar, ExternalLink, User } from "lucide-react";

const navItems = [
  { href: "/horarios", label: "1", title: "Horarios personalizados" },
  { href: "/links", label: "2", title: "Links externos" },
];

export function AppHeader({ perfilNombre }: { perfilNombre?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-400">Navegación</span>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/perfil"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
      >
        <User className="h-4 w-4 text-emerald-400" />
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
    <section className="flex min-h-[320px] flex-col rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {action}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
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
      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}

export function CalendarSectionTitle() {
  return (
    <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-100">
      <Calendar className="h-5 w-5 text-emerald-400" />
      Calendario
    </div>
  );
}
