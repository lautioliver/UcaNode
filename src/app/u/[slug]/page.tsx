import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { UniversidadHub } from "@/components/universidad-hub";
import {
  getUniversidad,
  listUniversidades,
} from "@/lib/universidades/catalogo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listUniversidades().map((universidad) => ({ slug: universidad.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const universidad = getUniversidad(slug);
  if (!universidad) {
    return { title: "Universidad no encontrada — UcaNode" };
  }
  if (universidad.estado === "activa") {
    return {
      title: `UcaNode — Autogestión ${universidad.nombreCorto}`,
      description: universidad.descripcion,
    };
  }
  return {
    title: `UcaNode — ${universidad.nombreCorto} en construcción`,
    description: universidad.descripcion,
  };
}

export default async function UniversidadHubPage({ params }: Props) {
  const { slug } = await params;
  const universidad = getUniversidad(slug);
  if (!universidad) notFound();
  if (universidad.estado === "activa") redirect("/");

  const cookieStore = await cookies();
  const dark = cookieStore.get("ucanode_theme")?.value !== "light";

  return <UniversidadHub universidad={universidad} initialDark={dark} />;
}
