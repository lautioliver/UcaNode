import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UcaNode — Autogestión Ucasal",
  description:
    "Sistema de autogestión para estudiantes de Ingeniería Informática de la Ucasal",
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/materias", label: "Materias" },
  { href: "/entregas", label: "Entregas" },
  { href: "/horarios", label: "Horarios" },
  { href: "/links", label: "Links" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const perfil = await prisma.perfil.findFirst();

  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-surface text-primary antialiased`}
      >
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div>
                <p className="text-lg font-semibold tracking-tight">UcaNode</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <nav className="flex flex-wrap gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-1.5 text-sm text-secondary transition hover:bg-surface-hover hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/perfil"
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-card px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-surface-hover"
              >
                <User className="h-4 w-4 text-accent" />
                {perfil?.nombre ?? "Perfil"}
              </Link>
              <ThemeToggle />
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
