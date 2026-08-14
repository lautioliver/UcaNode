import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Link2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { TiltCard } from "@/components/landing/tilt-card";
import { AppPreview } from "@/components/landing/app-preview";
import { LandingThemeToggle } from "@/components/landing/theme-toggle";
import { CARRERAS_DISPONIBLES } from "@/lib/planes-estudio/catalogo";

export const metadata: Metadata = {
  title: "UcaNode — Autogestión Ucasal",
  description:
    "UcaNode es la autogestión de la Ucasal: entregas, horarios, materias con plan de estudios y estado del campus en un solo panel, para estudiantes de la universidad.",
};

export default async function LandingPage() {
  const cookieStore = await cookies();
  const dark = cookieStore.get("ucanode_theme")?.value !== "light";

  return (
    <div className="min-h-screen bg-surface text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8 shrink-0" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">UcaNode</p>
              <p className="text-[10px] text-muted">Autogestión Ucasal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-secondary md:flex">
            <a href="#que-es" className="transition hover:text-primary">
              Qué es
            </a>
            <a href="#para-quien" className="transition hover:text-primary">
              Para quién
            </a>
            <a href="#vista" className="transition hover:text-primary">
              La app
            </a>
            <a href="#pasos" className="transition hover:text-primary">
              Cómo empezar
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LandingThemeToggle initialDark={dark} />
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-full border border-border bg-surface-card px-4 text-sm font-medium text-secondary transition hover:border-border-strong hover:text-primary sm:inline-flex"
            >
              Ingresar
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent-ghost blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary shadow-[var(--shadow-card)]">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Autogestión para estudiantes de la Ucasal
            </span>
            <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Tu vida académica,{" "}
              <span className="text-accent">en un solo panel.</span>
            </h1>
            <p className="mx-auto max-w-lg text-base text-secondary sm:text-lg">
              UcaNode junta todo lo que te rodea en la facultad — entregas,
              horarios, materias con su plan de estudios, accesos y el estado
              del campus — para que dejes de buscar en mil lugares.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/registro"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white shadow-[var(--shadow-card)] transition hover:bg-accent-hover"
              >
                Empezar gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#que-es"
                className="inline-flex h-11 items-center rounded-full border border-border bg-surface-card px-6 text-sm font-medium text-secondary transition hover:border-border-strong hover:text-primary"
              >
                Qué es UcaNode
              </a>
            </div>

            <p className="text-xs text-muted">
              {CARRERAS_DISPONIBLES.length} carreras con plan de estudios cargado ·
              Gratis para estudiantes Ucasal
            </p>
          </div>

          {/* Preview 3D de escritorio */}
          <div className="relative mx-auto mt-14 w-full" style={{ perspective: "1600px" }}>
            <TiltCard maxTilt={5}>
              <AppPreview />
            </TiltCard>

            <div
              className="landing-float-a absolute -left-3 top-10 hidden rounded-xl border border-border bg-surface-card px-3.5 py-2.5 shadow-[var(--shadow-card-lg)] lg:block"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger-ghost text-danger">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold text-primary">2 urgentes</p>
                  <p className="text-[10px] text-muted">Vencen esta semana</p>
                </div>
              </div>
            </div>

            <div
              className="landing-float-b absolute -right-2 bottom-16 hidden rounded-xl border border-border bg-surface-card px-3.5 py-2.5 shadow-[var(--shadow-card-lg)] lg:block"
              style={{ transform: "translateZ(60px)" }}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-ghost text-success">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold text-primary">3 a tiempo</p>
                  <p className="text-[10px] text-muted">Vas bien encaminado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es */}
      <section id="que-es" className="border-t border-border bg-surface-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                ¿Qué es UcaNode?
              </h2>
              <p className="text-secondary">
                UcaNode es un panel de autogestión hecho para estudiantes de la
                Ucasal. Reemplaza la lista de pestañas, los apuntes sueltos y
                los &quot;¿cuándo era el parcial?&quot; por un solo lugar donde se ve
                todo lo importante.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard
                icon={<ClipboardCheck className="h-5 w-5" />}
                title="Entregas"
                description="TPs, parciales y finales con fecha, estado y contadores de urgencia."
              />
              <FeatureCard
                icon={<CalendarDays className="h-5 w-5" />}
                title="Horarios"
                description="Tu semana en una vista, con clases presenciales y virtuales."
              />
              <FeatureCard
                icon={<BookOpen className="h-5 w-5" />}
                title="Plan de estudios"
                description="Tu carrera cargada con sus materias, correlatividades y avance."
              />
              <FeatureCard
                icon={<Link2 className="h-5 w-5" />}
                title="Accesos y links"
                description="Campus, aulas virtuales y sitios útiles guardados como favoritos."
              />
              <FeatureCard
                icon={<LineChart className="h-5 w-5" />}
                title="Analíticas"
                description="Completitud, entregas a tiempo y notas por materia, de un vistazo."
              />
              <FeatureCard
                icon={<MapPin className="h-5 w-5" />}
                title="Estado del campus"
                description="Novedades del comedor y las zonas del campus en tiempo real."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section id="para-quien" className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Para quien estudia en la Ucasal
            </h2>
            <p className="text-secondary">
              Elegí tu carrera y su plan de estudios se carga solo. Hoy hay{" "}
              {CARRERAS_DISPONIBLES.length} disponibles:
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CARRERAS_DISPONIBLES.map((c) => (
              <div
                key={c.slug}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {c.nombre}
                  </p>
                  <p className="text-xs text-muted">
                    Plan {c.planAnio} · {c.modalidad}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface-card p-5 sm:flex-row sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary">
                ¿Estudiás otra carrera?
              </p>
              <p className="text-sm text-secondary">
                Estas son las que tenemos cargadas hoy, pero podés solicitar que
                agreguemos la tuya completando un formulario corto.
              </p>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfk8aGnT5H3ZUOw1yox376Q4k5Fj-PTEtn7JMAeRU00c1Ttgw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Solicitar carrera
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* La app — preview 3D */}
      <section id="vista" className="relative overflow-hidden border-t border-border bg-surface-subtle">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-accent-ghost blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary">
                Panel de control
              </span>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Al entrar, ya sabés qué hacer
              </h2>
              <p className="text-secondary">
                El dashboard te muestra lo que importa hoy: qué entrega vence,
                qué materias cursás y qué hay en el campus. Después profundizás
                cuando hace falta.
              </p>
            </div>

            <div className="grid gap-3 text-left sm:grid-cols-3">
              <CheckItem
                icon={<Check className="h-4 w-4" />}
                title="Prioridades claras"
                description="Urgentes, de la semana y a tiempo: cada entrega en su lugar."
              />
              <CheckItem
                icon={<Users className="h-4 w-4" />}
                title="Comunidad estudiantil"
                description="Compartí apuntes y resolvé dudas con gente de tu carrera."
              />
              <CheckItem
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Tu cuenta, tu control"
                description="Registro con tu email habitual y recuperación segura de contraseña."
              />
            </div>

            <Link
              href="/registro"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Probalo ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo empezar */}
      <section id="pasos" className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Empezar toma menos de un minuto
            </h2>
            <p className="text-secondary">
              Sin cargas manuales de catálogos ni datos que rellenar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <StepCard
              n="1"
              title="Creá tu cuenta"
              description="Registrate con tu email (Gmail, Outlook o el que uses) y creá tu contraseña."
            />
            <StepCard
              n="2"
              title="Elegí tu carrera"
              description="Seleccioná tu carrera y su plan de estudios se carga automáticamente."
            />
            <StepCard
              n="3"
              title="Cargá tu semestre"
              description="Agregá materias, horarios y entregas. Listo: tenés todo a la vista."
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-border bg-surface-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Organizá tu semestre sin perder nada
            </h2>
            <p className="mx-auto max-w-lg text-secondary">
              UcaNode está pensado para que dejes de andar buscando fechas y
              aulas, y empieces a estudiar tranquilo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/registro"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                Crear cuenta gratis
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Marca */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <span className="flex items-center gap-2.5">
                  <LogoMark className="h-7 w-7 shrink-0" />
                  <span className="block text-[15px] font-semibold leading-tight text-primary">
                    UcaNode
                  </span>
                </span>
                <span className="block text-[11px] leading-tight text-muted">
                  Autogestión Ucasal
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-secondary">
                Autogestión académica para organizar materias, entregas,
                horarios y recursos en un solo lugar.
              </p>
            </div>

            {/* Navegación */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Navegación
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#que-es"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Qué es UcaNode
                  </a>
                </li>
                <li>
                  <a
                    href="#para-quien"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Para quién
                  </a>
                </li>
                <li>
                  <a
                    href="#vista"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    La app
                  </a>
                </li>
                <li>
                  <a
                    href="#pasos"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Cómo empezar
                  </a>
                </li>
                <li>
                  <Link
                    href="/registro"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Crear cuenta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Ingresar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Recursos
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.ucasal.edu.ar/htm/sead/plataformasvirtuales/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
                  >
                    Campus Ucasal
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ucasal.edu.ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
                  >
                    Sitio Ucasal
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://campustatus.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
                  >
                    Campustatus
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/lautioliver/UcaNode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
                  >
                    GitHub UcaNode
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/terminos-y-condiciones"
                    className="inline-flex items-center gap-1 text-sm text-secondary transition hover:text-primary"
                  >
                    Términos y condiciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Proyecto */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Proyecto
              </p>
              <ul className="space-y-2 text-sm text-secondary">
                <li>PostgreSQL (Neon)</li>
                <li>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    En desarrollo activo
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted" />
                    <a
                      href="mailto:ucanodesoporte@gmail.com"
                      className="text-secondary transition hover:text-primary"
                    >
                      ucanodesoporte@gmail.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} UcaNode. Herramienta personal para
              estudiantes de la Ucasal.
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <span className="font-mono text-[10px] tracking-wide text-secondary">
                v0.1
              </span>
              <span className="h-1 w-1 rounded-full bg-border-strong" />
              Hecho con Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)] transition hover:border-border-strong">
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

function CheckItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-ghost text-accent">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-secondary">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  n,
  title,
  description,
}: {
  n: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
        {n}
      </span>
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-sm text-secondary">{description}</p>
      </div>
    </div>
  );
}
