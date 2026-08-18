import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Construction,
  GraduationCap,
  ListChecks,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { LogoMark } from "@/components/logo";
import { LandingThemeToggle } from "@/components/landing/theme-toggle";
import {
  getUniversidadNovedades,
} from "@/lib/universidades/catalogo";
import type { UniversidadCatalogo } from "@/lib/universidades/types";

function formatFechaNovedad(fecha: string) {
  return format(parseISO(fecha), "d 'de' MMMM yyyy", { locale: es });
}

export function UniversidadHub({
  universidad,
  initialDark,
}: {
  universidad: UniversidadCatalogo;
  initialDark: boolean;
}) {
  const novedades = getUniversidadNovedades(universidad);

  return (
    <div className="min-h-screen bg-surface text-primary">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8 shrink-0" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">UcaNode</p>
              <p className="text-[10px] text-muted">{universidad.nombreCorto}</p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LandingThemeToggle initialDark={initialDark} />
            <Link
              href="/"
              className="hidden h-9 items-center rounded-full border border-border bg-surface-card px-4 text-sm font-medium text-secondary transition hover:border-border-strong hover:text-primary sm:inline-flex"
            >
              Ir a Ucasal
            </Link>
            <Link
              href="/registro"
              className="inline-flex h-9 items-center rounded-full bg-accent px-3.5 text-sm font-medium text-white transition hover:bg-accent-hover sm:px-4"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-warning-ghost blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary shadow-[var(--shadow-card)]">
              <Construction className="h-3.5 w-3.5 text-warning" />
              En construcción
            </span>
            <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              UcaNode para la{" "}
              <span className="text-accent">{universidad.nombreCorto}</span>
            </h1>
            <p className="text-sm font-medium text-muted">{universidad.tagline}</p>
            <p className="mx-auto max-w-lg text-base text-secondary sm:text-lg">
              {universidad.descripcion}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#novedades"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white shadow-[var(--shadow-card)] transition hover:bg-accent-hover"
              >
                Ver novedades
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-full border border-border bg-surface-card px-6 text-sm font-medium text-secondary transition hover:border-border-strong hover:text-primary"
              >
                Ver UcaNode en Ucasal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-subtle py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Qué estamos armando
            </h2>
            <p className="mt-3 text-sm text-secondary sm:text-base">
              El mismo modelo de UCASAL, adaptado a {universidad.nombreCorto}:
              primero el catálogo, después el onboarding.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HubCard
              icon={<GraduationCap className="h-4 w-4" />}
              title="Catálogo de carreras"
              description="Listar las carreras que van a vivir en UcaNode, con slug y datos oficiales."
            />
            <HubCard
              icon={<BookOpen className="h-4 w-4" />}
              title="Planes de estudio"
              description="Cargar correlatividades en JSON, igual que el flujo que ya usamos para UCASAL."
            />
            <HubCard
              icon={<ListChecks className="h-4 w-4" />}
              title="Onboarding"
              description="Cuando el catálogo esté listo, el registro y la elección de carrera se abren para esta universidad."
            />
          </div>
        </div>
      </section>

      <section id="novedades" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Novedades
          </h2>
          <p className="mt-3 text-sm text-secondary sm:text-base">
            Avances del espacio {universidad.nombreCorto}. Se actualizan acá a
            medida que avanza la integración.
          </p>

          {novedades.length === 0 ? (
            <p className="mt-8 text-sm text-muted">
              Todavía no hay novedades publicadas.
            </p>
          ) : (
            <ol className="relative mt-10 space-y-6 border-l border-border pl-6">
              {novedades.map((novedad) => (
                <li key={`${novedad.fecha}-${novedad.titulo}`} className="relative">
                  <span className="absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full border border-border-accent bg-accent" />
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                    {formatFechaNovedad(novedad.fecha)}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-primary">
                    {novedad.titulo}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-secondary">
                    {novedad.cuerpo}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-surface-subtle py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            UCASAL ya está disponible
          </h2>
          <p className="max-w-lg text-sm text-secondary sm:text-base">
            Si estudiás en la Ucasal, podés crear tu cuenta ahora. El registro
            de {universidad.nombreCorto} se habilita cuando este espacio deje de
            estar en construcción.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/registro"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Crear cuenta Ucasal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-full border border-border bg-surface-card px-6 text-sm font-medium text-secondary transition hover:border-border-strong hover:text-primary"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex gap-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-secondary">
              UcaNode es una iniciativa independiente y no forma parte, no está
              afiliada ni representa oficialmente a {universidad.nombre} ni a
              ninguna otra institución educativa.{" "}
              <Link
                href="/terminos-y-condiciones"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Términos y condiciones
              </Link>
              {universidad.sitioOficial ? (
                <>
                  {" · "}
                  <a
                    href={universidad.sitioOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Sitio oficial
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} UcaNode. Espacio {universidad.nombreCorto}{" "}
            en construcción.
          </p>
          <p className="inline-flex items-center gap-2 text-xs text-muted">
            <Mail className="h-3.5 w-3.5" />
            <a
              href="mailto:ucanodesoporte@gmail.com"
              className="transition hover:text-primary"
            >
              ucanodesoporte@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function HubCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-ghost text-accent">
        {icon}
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-secondary">{description}</p>
      </div>
    </div>
  );
}
