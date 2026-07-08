"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  Sun,
  User,
  X,
} from "lucide-react";

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
  initialCollapsed,
  initialDark,
}: {
  perfilNombre?: string | null;
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

  const widthClass = collapsed ? "lg:w-[72px]" : "lg:w-[240px]";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-card text-primary shadow-sm transition hover:bg-surface-hover lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        data-collapsed={collapsed}
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface-card transition-[transform,width] duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${widthClass}`}
      >
        <div
          className={`flex items-center gap-3 border-b border-border px-4 py-4 ${
            collapsed ? "lg:justify-center lg:px-2" : ""
          }`}
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-center gap-3"
            title="UcaNode"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-ghost text-accent">
              <BookOpen className="h-5 w-5" />
            </span>
            {(!collapsed || mobileOpen) && (
              <span className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">UcaNode</p>
                <p className="truncate text-[11px] text-muted">Ing. Informática · Ucasal</p>
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

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? label : undefined}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-accent-ghost text-accent"
                        : "text-secondary hover:bg-surface-hover hover:text-primary"
                    } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-y-1 left-0 w-1 rounded-r bg-accent"
                      />
                    )}
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-accent" : "text-muted group-hover:text-primary"
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate">{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <Link
            href="/perfil"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? perfilNombre ?? "Perfil" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              isActive("/perfil")
                ? "bg-accent-ghost text-accent"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent ${
                isActive("/perfil") ? "border-accent" : ""
              }`}
            >
              <User className="h-4 w-4" />
            </span>
            {(!collapsed || mobileOpen) && (
              <span className="min-w-0 truncate">{perfilNombre ?? "Perfil"}</span>
            )}
          </Link>

          <div
            className={`mt-1 flex items-center gap-1 ${
              collapsed ? "lg:flex-col" : "justify-between"
            }`}
          >
            <button
              type="button"
              onClick={toggleTheme}
              title={dark ? "Modo claro" : "Modo oscuro"}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-secondary transition hover:bg-surface-hover hover:text-accent"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {(!collapsed || mobileOpen) && (
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
