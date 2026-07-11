import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ExternalLink,
  Link2,
  Star,
} from "lucide-react";
import { DiaSemana, EstadoMateria } from "@/generated/prisma/client";
import { AgendaResumida } from "@/components/agenda-resumida";
import { EntregaCard } from "@/components/entrega-card";
import {
  CounterChip,
  EmptyState,
  LinkButton,
  PageHeader,
  SectionCard,
} from "@/components/layout";
import { categoriaLinkLabel, diaSemanaLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { daysUntil } from "@/lib/entrega-utils";

export const metadata: Metadata = {
  title: "Dashboard — UcaNode",
};

function currentDayEnum(): DiaSemana | null {
  const idx = new Date().getDay();
  const map: Record<number, DiaSemana | null> = {
    0: null,
    1: DiaSemana.LUNES,
    2: DiaSemana.MARTES,
    3: DiaSemana.MIERCOLES,
    4: DiaSemana.JUEVES,
    5: DiaSemana.VIERNES,
    6: null,
  };
  return map[idx];
}

export default async function DashboardPage() {
  const [entregas, materiasCursando, horarios, favoritos] = await Promise.all([
    prisma.entrega.findMany({
      include: { materia: true },
      orderBy: { fecha: "asc" },
    }),
    prisma.materia.findMany({
      where: { estado: EstadoMateria.CURSANDO },
      orderBy: { nombre: "asc" },
    }),
    prisma.horario.findMany({
      include: { materia: true },
      orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
    }),
    prisma.linkExterno.findMany({
      where: { favorito: true },
      orderBy: { nombre: "asc" },
      take: 4,
    }),
  ]);

  const pendientes = entregas.filter((e) => e.estado !== "ENTREGADO");
  const urgentes = pendientes.filter((e) => daysUntil(e.fecha) < 2);
  const enSemana = pendientes.filter((e) => {
    const d = daysUntil(e.fecha);
    return d >= 2 && d <= 7;
  });
  const aTiempo = pendientes.filter((e) => daysUntil(e.fecha) > 7);

  const proximas = pendientes
    .filter((e) => daysUntil(e.fecha) >= -3)
    .slice(0, 4);

  const hoy = currentDayEnum();
  const clasesHoy = hoy ? horarios.filter((h) => h.dia === hoy) : [];

  return (
    <main className="space-y-8">
      <PageHeader
        pill="Actualizado desde tus datos"
        title="¿Qué necesitás hacer esta semana?"
        description="Un vistazo rápido a tus entregas pendientes, materias en curso y accesos rápidos para arrancar el día."
        action={<LinkButton href="/entregas">Ver todas</LinkButton>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <CounterChip tone="danger" count={urgentes.length} label="Urgentes" />
        <CounterChip tone="warning" count={enSemana.length} label="Esta semana" />
        <CounterChip tone="success" count={aTiempo.length} label="A tiempo" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary">
            Próximas entregas
          </h2>
          <LinkButton href="/entregas">Gestionar</LinkButton>
        </div>
        {proximas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {proximas.map((e) => (
              <EntregaCard key={e.id} entrega={e} />
            ))}
          </div>
        ) : (
          <EmptyState message="Sin entregas pendientes. ¡Aprovechá para adelantar!" />
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Clases de hoy"
          action={<LinkButton href="/horarios">Semana</LinkButton>}
          className="lg:col-span-1"
        >
          {clasesHoy.length > 0 ? (
            <ul className="space-y-2">
              {clasesHoy.map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border border-border bg-surface p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-primary">
                      {h.materia.nombre}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        h.modalidad === "PRESENCIAL"
                          ? "bg-success-ghost text-success"
                          : "bg-accent-ghost text-accent"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          h.modalidad === "PRESENCIAL"
                            ? "bg-success"
                            : "bg-accent"
                        }`}
                      />
                      {h.modalidad === "PRESENCIAL" ? "Presencial" : "Virtual"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {h.horaInicio} – {h.horaFin}
                    {h.aulaLink ? ` · ${h.aulaLink}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message={hoy ? "Sin clases hoy." : "Es fin de semana."} />
          )}
        </SectionCard>

        <SectionCard
          title="Materias en curso"
          action={<LinkButton href="/materias">Ver</LinkButton>}
          className="lg:col-span-1"
        >
          {materiasCursando.length > 0 ? (
            <ul className="space-y-2">
              {materiasCursando.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/materias/${m.id}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition hover:border-border-strong"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <BookOpen className="h-4 w-4 shrink-0 text-accent" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-primary">
                          {m.nombre}
                        </p>
                        {m.dia && (
                          <p className="text-[10px] text-muted">
                            {diaSemanaLabel[m.dia]}
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Aún no cargaste materias en curso." />
          )}
        </SectionCard>

        <SectionCard
          title="Accesos favoritos"
          action={<LinkButton href="/links">Links</LinkButton>}
          className="lg:col-span-1"
        >
          {favoritos.length > 0 ? (
            <ul className="space-y-2">
              {favoritos.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition hover:border-border-strong"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Link2 className="h-4 w-4 shrink-0 text-accent" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-primary">
                          {link.nombre}
                        </p>
                        <p className="text-[10px] text-muted">
                          {categoriaLinkLabel[link.categoria]}
                        </p>
                      </div>
                    </div>
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Marcá links como favoritos para verlos acá." />
          )}
        </SectionCard>
      </div>

      <AgendaResumida entregas={entregas} limite={4} />

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction
          href="/entregas"
          Icon={ClipboardCheck}
          title="Registrar entrega"
          description="Sumá un TP, parcial o final."
        />
        <QuickAction
          href="/horarios"
          Icon={CalendarDays}
          title="Cargar horario"
          description="Definí tu semana."
        />
        <QuickAction
          href="/materias"
          Icon={BookOpen}
          title="Nueva materia"
          description="Sumá una al listado."
        />
      </div>
    </main>
  );
}

function QuickAction({
  href,
  Icon,
  title,
  description,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-surface-card p-4 transition hover:border-border-strong"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-ghost text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted transition group-hover:text-accent" />
    </Link>
  );
}
