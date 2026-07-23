"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { EntregaFab } from "@/components/entrega-fab";
import { FantasmaGate } from "@/components/fantasma-gate";
import { OnboardingCarrera } from "@/components/onboarding-carrera";
import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import type { ActionResult } from "@/lib/actions";

function isAuthRoute(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/registro") ||
    pathname.startsWith("/verificar-email")
  );
}

export function LayoutClient({
  children,
  dark,
  perfil,
  collapsed,
  cuentaRegistrada,
  carreras,
  materias,
  confirmarCarreraAction,
  nextPath,
}: {
  children: React.ReactNode;
  dark: boolean;
  perfil: {
    id: string;
    nombre: string | null;
    emailUcasal: string | null;
    carreraId: string | null;
    carreraNombre: string | null;
    fantasma: boolean;
  } | null;
  collapsed: boolean;
  cuentaRegistrada: boolean;
  carreras: CarreraCatalogo[];
  materias: { id: string; nombre: string }[];
  confirmarCarreraAction: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  nextPath?: string;
}) {
  const pathname = usePathname();

  if (isAuthRoute(pathname)) {
    return <>{children}</>;
  }

  if (!perfil) {
    return <>{children}</>;
  }

  if (perfil.fantasma) {
    return <FantasmaGate next={nextPath} />;
  }

  if (!perfil.carreraId) {
    return (
      <OnboardingCarrera
        action={confirmarCarreraAction}
        perfilId={perfil.id}
        carreras={carreras}
      />
    );
  }

  return (
    <div className="min-h-screen w-full lg:flex">
      <Sidebar
        perfilNombre={perfil.nombre}
        carreraNombre={perfil.carreraNombre}
        cuentaRegistrada={cuentaRegistrada}
        initialCollapsed={collapsed}
      />
      <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
        <Topbar
          perfilNombre={perfil.nombre}
          perfilEmail={perfil.emailUcasal}
          cuentaRegistrada={cuentaRegistrada}
          initialDark={dark}
        />
        <div className="w-full flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-4 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-clip">{children}</div>
        </div>
        <Footer carreraNombre={perfil.carreraNombre} />
      </div>
      <EntregaFab materias={materias} />
    </div>
  );
}
