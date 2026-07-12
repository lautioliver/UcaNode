"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Link2,
  Menu,
  Moon,
  LogOut,
  Sun,
  User,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/logo";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/materias", label: "Materias", Icon: BookOpen },
  { href: "/entregas", label: "Entregas", Icon: ClipboardCheck },
  { href: "/horarios", label: "Horarios", Icon: CalendarDays },
  { href: "/links", label: "Links", Icon: Link2 },
];

const COLLAPSED_COOKIE = "ucanode_sidebar_collapsed";
const THEME_COOKIE = "ucanode_theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function Sidebar({
  perfilNombre,
  cuentaRegistrada,
  initialCollapsed,
  initialDark,
}: {
  perfilNombre?: string | null;
  cuentaRegistrada: boolean;
  initialCollapsed: boolean;
  initialDark: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(initialDark);

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

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    setCookie(THEME_COOKIE, next ? "dark" : "light");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface-card transition-[transform,width] duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          collapsed ? "lg:w-[76px]" : "lg:w-[240px]"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-4 pt-6 pb-5 ${
            collapsed ? "lg:justify-center lg:px-2" : ""
          }`}
        >
          <Link
            href="/"
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
                  Ing. Informática · Ucasal
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

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {showLabels && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Navegación
            </p>
          )}
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? label : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-accent-ghost text-primary"
                        : "text-secondary hover:bg-surface-hover hover:text-primary"
                    } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-accent" : "text-muted group-hover:text-primary"
                      }`}
                    />
                    {showLabels && (
                      <span className={active ? "font-medium" : ""}>{label}</span>
                    )}
                    {active && showLabels && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          {cuentaRegistrada && (
            <form action={logout} className="mb-2">
              <button
                type="submit"
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-secondary transition hover:bg-surface-hover hover:text-primary ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                }`}
                title="Cerrar sesión"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted">
                  <LogOut className="h-4 w-4" />
                </span>
                {showLabels && <span>Cerrar sesión</span>}
              </button>
            </form>
          )}

          <Link
            href="/perfil"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? perfilNombre ?? "Perfil" : undefined}
            className={`mb-1 flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition ${
              isActive("/perfil")
                ? "bg-accent-ghost"
                : "hover:bg-surface-hover"
            } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-accent ${
                isActive("/perfil")
                  ? "bg-accent-subtle"
                  : "bg-surface-hover"
              }`}
            >
              <User className="h-4 w-4" />
            </span>
            {showLabels && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-primary">
                  {perfilNombre ?? "Perfil"}
                </p>
                <p className="truncate text-[10px] text-muted">Ver perfil</p>
              </div>
            )}
          </Link>

          <div
            className={`flex items-center gap-1 ${
              collapsed ? "lg:flex-col" : "justify-between"
            }`}
          >
            <button
              type="button"
              onClick={toggleTheme}
              title={dark ? "Modo claro" : "Modo oscuro"}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-secondary transition hover:bg-surface-hover hover:text-primary"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {showLabels && (
                <span>{dark ? "Modo claro" : "Modo oscuro"}</span>
              )}
            </button>
            <button
              type="button"
              onClick={toggleCollapsed}
              title={collapsed ? "Expandir" : "Colapsar"}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-primary lg:inline-flex"
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
