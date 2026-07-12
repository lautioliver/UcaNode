import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { EntregaFab } from "@/components/entrega-fab";
import { OnboardingCarrera } from "@/components/onboarding-carrera";
import { confirmarCarrera } from "@/lib/actions";
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
  title: "UcaNode — Autogestión Ucasal",
  description:
    "Sistema de autogestión para estudiantes de la Ucasal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [perfil, cookieStore] = await Promise.all([getOrCreatePerfil(), cookies()]);

  const collapsed = cookieStore.get("ucanode_sidebar_collapsed")?.value === "1";
  const themeCookie = cookieStore.get("ucanode_theme")?.value;
  const dark = themeCookie !== "light";

  if (!perfil.carreraId) {
    return (
      <html lang="es" className={dark ? "dark" : ""}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-surface text-primary antialiased`}
        >
          <OnboardingCarrera
            action={confirmarCarrera}
            perfilId={perfil.id}
            carreras={listCarrerasDisponibles()}
          />
        </body>
      </html>
    );
  }

  const materias = await prisma.materia.findMany({
    where: { perfilId: perfil.id },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <html lang="es" className={dark ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-surface text-primary antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar
            perfilNombre={perfil.nombre}
            initialCollapsed={collapsed}
            initialDark={dark}
          />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <div className="w-full flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-16 max-lg:pl-14 sm:px-6 lg:px-8 lg:pb-10 lg:pl-8 lg:pt-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </div>
            <Footer />
          </div>
          <EntregaFab materias={materias} />
        </div>
      </body>
    </html>
  );
}
