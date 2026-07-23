import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/app-url";
import { LayoutClient } from "@/components/layout-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { confirmarCarrera } from "@/lib/actions";
import { isPerfilPendienteVerificacion, isPerfilRegistrado } from "@/lib/auth";
import { listCarrerasDisponibles } from "@/lib/planes-estudio/catalogo";
import { displayEmailUcasal, getPerfil, isAuthPath, requirePerfil } from "@/lib/perfil";
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

  const hdrs = await headers();
  const pathnameWithSearch = hdrs.get("x-pathname") ?? "/";
  const pathname = pathnameWithSearch.split("?")[0] ?? "/";
  const onAuthRoute = isAuthPath(pathname);

  const perfil = onAuthRoute ? await getPerfil() : await requirePerfil();

  if (!onAuthRoute && perfil) {
    if (perfil.fantasma) {
      // FantasmaGate rendered in LayoutClient
    } else if (isPerfilPendienteVerificacion(perfil)) {
      const url = `/verificar-email?email=${encodeURIComponent(perfil.emailUcasal!)}&next=${encodeURIComponent(pathnameWithSearch)}`;
      redirect(url);
    } else if (!isPerfilRegistrado(perfil)) {
      redirect(`/login?next=${encodeURIComponent(pathnameWithSearch)}`);
    }
  }

  const collapsed = cookieStore.get("ucanode_sidebar_collapsed")?.value === "1";
  const cuentaRegistrada = perfil ? isPerfilRegistrado(perfil) : false;

  const perfilConCarrera =
    perfil?.carreraId
      ? await prisma.perfil.findUnique({
          where: { id: perfil.id },
          include: { carrera: true },
        })
      : null;

  // Materias para el FAB de "nueva entrega"; la búsqueda global consulta
  // el servidor bajo demanda (src/lib/search.ts).
  const materias = perfil?.carreraId
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
        <TooltipProvider>
          <LayoutClient
            dark={dark}
            perfil={
              perfil
                ? {
                    id: perfil.id,
                    nombre: perfil.nombre,
                    emailUcasal: displayEmailUcasal(perfil.emailUcasal) || null,
                    carreraId: perfil.carreraId,
                    carreraNombre: perfilConCarrera?.carrera?.nombre ?? null,
                    fantasma: perfil.fantasma,
                  }
                : null
            }
            collapsed={collapsed}
            cuentaRegistrada={cuentaRegistrada}
            carreras={listCarrerasDisponibles()}
            materias={materias}
            confirmarCarreraAction={confirmarCarrera}
            nextPath={pathnameWithSearch}
          >
            {children}
          </LayoutClient>
        </TooltipProvider>
      </body>
    </html>
  );
}
