"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_COOKIE = "ucanode_theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Toggle de tema claro/oscuro para la landing (comparte cookie con la app). */
export function LandingThemeToggle({ initialDark = true }: { initialDark?: boolean }) {
  const [dark, setDark] = useState(initialDark);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    setCookie(THEME_COOKIE, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-card text-secondary transition hover:border-border-strong hover:text-primary"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
