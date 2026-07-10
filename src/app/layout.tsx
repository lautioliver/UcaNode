import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";
import { EntregaFab } from "@/components/entrega-fab";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [perfil, materias, cookieStore] = await Promise.all([
    prisma.perfil.findFirst(),
    prisma.materia.findMany({ orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
    cookies(),
  ]);

  const collapsed = cookieStore.get("ucanode_sidebar_collapsed")?.value === "1";
  const themeCookie = cookieStore.get("ucanode_theme")?.value;
  const dark = themeCookie !== "light";

  return (
    <html lang="es" className={dark ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-surface text-primary antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar
            perfilNombre={perfil?.nombre}
            initialCollapsed={collapsed}
            initialDark={dark}
          />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <div className="w-full flex-1 px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </div>
          </div>
          <EntregaFab materias={materias} />
        </div>
      </body>
    </html>
  );
}
