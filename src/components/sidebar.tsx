"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/logo";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const MENU_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/materias", label: "Materias", Icon: BookOpen },
  { href: "/entregas", label: "Entregas", Icon: ClipboardCheck },
  { href: "/analytics", label: "Analíticas", Icon: BarChart3 },
  { href: "/horarios", label: "Horarios", Icon: CalendarDays },
  { href: "/concurrencia", label: "Concurrencia", Icon: Users },
  { href: "/links", label: "Links", Icon: Link2 },
];

const GENERAL_ITEMS: NavItem[] = [
  { href: "/perfil", label: "Configuración", Icon: Settings },
];

const COLLAPSED_COOKIE = "ucanode_sidebar_collapsed";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function NavLink({
  href,
  label,
  Icon,
  active,
  collapsed,
  showLabels,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
  showLabels: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-accent text-white shadow-[var(--shadow-sm)]"
          : "text-secondary hover:bg-surface-hover hover:text-primary"
      } ${collapsed ? "lg:justify-center lg:px-2.5" : ""}`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${
          active ? "text-white" : "text-muted group-hover:text-primary"
        }`}
      />
      {showLabels && <span className={active ? "font-medium" : ""}>{label}</span>}
    </Link>
  );
}

export function Sidebar({
  perfilNombre,
  carreraNombre,
  cuentaRegistrada,
  initialCollapsed,
}: {
  perfilNombre?: string | null;
  carreraNombre?: string | null;
  cuentaRegistrada: boolean;
  initialCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    setCookie(COLLAPSED_COOKIE, next ? "1" : "0");
  }

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard" || pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-card text-primary shadow-[var(--shadow-card)] transition hover:bg-surface-hover lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        data-collapsed={collapsed}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] flex-col border-r border-border bg-surface-nav transition-[transform,width] duration-200 ease-out max-lg:will-change-transform ${
          mobileOpen
            ? "translate-x-0 max-lg:pointer-events-auto"
            : "-translate-x-full max-lg:pointer-events-none"
        } lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:will-change-auto ${
          collapsed ? "lg:w-[84px]" : "lg:w-[260px]"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-5 pt-6 pb-4 ${
            collapsed ? "lg:justify-center lg:px-3" : ""
          }`}
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-center gap-3"
            title="UcaNode"
          >
            <LogoMark className="h-9 w-9 shrink-0" />
            {showLabels && (
              <span className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-tight text-primary">
                  UcaNode
                </p>
                <p className="truncate text-[11px] leading-tight text-muted">
                  {carreraNombre ?? "Autogestión Ucasal"}
                </p>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface-hover hover:text-primary lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
          <div>
            {showLabels && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Menú
              </p>
            )}
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    {...item}
                    active={isActive(item.href)}
                    collapsed={collapsed}
                    showLabels={showLabels}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            {showLabels && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                General
              </p>
            )}
            <ul className="space-y-1">
              {GENERAL_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    {...item}
                    active={isActive(item.href)}
                    collapsed={collapsed}
                    showLabels={showLabels}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </li>
              ))}
              {cuentaRegistrada && (
                <li>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      title={collapsed ? "Cerrar sesión" : undefined}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-secondary transition hover:bg-surface-hover hover:text-primary ${
                        collapsed ? "lg:justify-center lg:px-2.5" : ""
                      }`}
                    >
                      <LogOut className="h-4 w-4 shrink-0 text-muted group-hover:text-primary" />
                      {showLabels && <span>Cerrar sesión</span>}
                    </button>
                  </form>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div className="border-t border-border p-4">
          {showLabels && perfilNombre && (
            <div className="mb-3 rounded-xl bg-surface-subtle px-3 py-2">
              <p className="truncate text-sm font-medium text-primary">{perfilNombre}</p>
              <p className="truncate text-[11px] text-muted">Sesión activa</p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir" : "Colapsar"}
            className="hidden h-9 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs text-muted transition hover:bg-surface-hover hover:text-primary lg:inline-flex"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Colapsar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
