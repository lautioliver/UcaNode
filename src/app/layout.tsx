import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { getSiteUrl } from "@/lib/app-url";
import { LayoutClient } from "@/components/layout-client";
import { confirmarCarrera } from "@/lib/actions";
import { isPerfilRegistrado } from "@/lib/auth";
import { listCarrerasDisponibles } from "@/lib/planes-estudio/catalogo";
import { getOrCreatePerfil } from "@/lib/perfil";
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
  metadataBase: new URL(getSiteUrl()),
  title: "UcaNode — Autogestión Ucasal",
  description:
    "Sistema de autogestión para estudiantes de la Ucasal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ucanode_theme")?.value;
  const dark = themeCookie !== "light";

  const perfil = await getOrCreatePerfil();
  const collapsed = cookieStore.get("ucanode_sidebar_collapsed")?.value === "1";
  const cuentaRegistrada = isPerfilRegistrado(perfil);

  const materias = perfil.carreraId
    ? await prisma.materia.findMany({
        where: { perfilId: perfil.id },
        orderBy: { nombre: "asc" },
        select: { id: true, nombre: true },
      })
    : [];

  return (
    <html lang="es" className={dark ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-surface text-primary antialiased`}
      >
        <LayoutClient
          dark={dark}
          perfil={{ id: perfil.id, nombre: perfil.nombre, carreraId: perfil.carreraId }}
          collapsed={collapsed}
          cuentaRegistrada={cuentaRegistrada}
          carreras={listCarrerasDisponibles()}
          materias={materias}
          confirmarCarreraAction={confirmarCarrera}
        >
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
