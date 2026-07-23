"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Moon, Search, Sun, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/global-search";

const THEME_COOKIE = "ucanode_theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function initials(name: string | null | undefined) {
  if (!name?.trim()) return "UN";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Topbar({
  perfilNombre,
  perfilEmail,
  cuentaRegistrada,
  initialDark,
}: {
  perfilNombre?: string | null;
  perfilEmail?: string | null;
  cuentaRegistrada: boolean;
  initialDark: boolean;
}) {
  const [dark, setDark] = useState(initialDark);
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    setCookie(THEME_COOKIE, next ? "dark" : "light");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="hidden flex-1 lg:block">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-border bg-surface-card px-3 text-sm text-muted transition hover:border-border-strong hover:text-secondary"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate text-left">
                Buscar materias, entregas, links...
              </span>
              <kbd className="rounded-md border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl lg:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={toggleTheme}
              aria-label={dark ? "Modo claro" : "Modo oscuro"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface-card px-2 py-1.5 transition hover:border-border-strong"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent-subtle text-xs font-semibold text-accent">
                      {initials(perfilNombre)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-primary sm:block">
                    {perfilNombre ?? "Perfil"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium">{perfilNombre ?? "Estudiante"}</p>
                  {perfilEmail && (
                    <p className="truncate text-xs text-muted-foreground">{perfilEmail}</p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="h-4 w-4" />
                    Perfil y configuración
                  </Link>
                </DropdownMenuItem>
                {cuentaRegistrada && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action="/api/auth/logout" method="POST" className="w-full">
                        <button type="submit" className="flex w-full items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} hideTrigger />
    </>
  );
}
