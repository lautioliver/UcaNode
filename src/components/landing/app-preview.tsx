"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  HardDrive,
  LayoutDashboard,
  Link2,
  MapPin,
  MessageSquare,
  RefreshCw,
  School,
  Search,
  Star,
  Sun,
  Users,
  Video,
} from "lucide-react";
import type { ComponentType } from "react";
import { LogoMark } from "@/components/logo";
import { EntregaCard, type EntregaLite } from "@/components/entrega-card";
import {
  CounterChip,
  FilterPill,
  ProgressBar,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/layout";
import {
  categoriaLinkLabel,
  diaSemanaLabel,
  estadoMateriaLabel,
  modalidadLabel,
} from "@/lib/labels";

type ViewId =
  | "dashboard"
  | "entregas"
  | "horarios"
  | "materias"
  | "links"
  | "comunidad"
  | "concurrencia";

const VIEWS: ViewId[] = [
  "dashboard",
  "entregas",
  "horarios",
  "materias",
  "links",
  "comunidad",
  "concurrencia",
];

const VIEW_LABEL: Record<ViewId, string> = {
  dashboard: "dashboard",
  entregas: "entregas",
  horarios: "horarios",
  materias: "materias",
  links: "links",
  comunidad: "comunidad",
  concurrencia: "concurrencia",
};

const NAV: { id: ViewId; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "entregas", label: "Entregas", Icon: ClipboardCheck },
  { id: "horarios", label: "Horarios", Icon: CalendarDays },
  { id: "materias", label: "Materias", Icon: BookOpen },
  { id: "links", label: "Links", Icon: Link2 },
  { id: "comunidad", label: "Comunidad", Icon: Users },
  { id: "concurrencia", label: "Concurrencia", Icon: Activity },
];

const ENTREGAS_EJEMPLO: EntregaLite[] = [
  {
    id: "preview-1",
    titulo: "TP N°2 · Modelado relacional",
    tipo: "TP",
    fecha: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    estado: "EN_CURSO",
    materia: { nombre: "Bases de Datos", codigo: "INF-403" },
  },
  {
    id: "preview-5",
    titulo: "Parcial · Colecciones",
    tipo: "PARCIAL",
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    estado: "EN_CURSO",
    materia: { nombre: "Programación II", codigo: "INF-102" },
  },
  {
    id: "preview-2",
    titulo: "Parcial · Distribuciones",
    tipo: "PARCIAL",
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estado: "PENDIENTE",
    materia: { nombre: "Probabilidad y Estadística", codigo: "INF-305" },
  },
  {
    id: "preview-3",
    titulo: "TP N°3 · Árboles y grafos",
    tipo: "TP",
    fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    estado: "PENDIENTE",
    materia: { nombre: "Estructura de Datos", codigo: "INF-206" },
  },
  {
    id: "preview-4",
    titulo: "Final · Integrales múltiples",
    tipo: "FINAL",
    fecha: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    estado: "PENDIENTE",
    materia: { nombre: "Matemática II", codigo: "INF-104" },
  },
  {
    id: "preview-6",
    titulo: "TP N°1 · Modelo entidad-relación",
    tipo: "TP",
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estado: "ENTREGADO",
    materia: { nombre: "Bases de Datos", codigo: "INF-403" },
  },
];

const HORARIOS_EJEMPLO = [
  { dia: "LUNES", horaInicio: "08:00", horaFin: "10:00", modalidad: "PRESENCIAL", materia: "Bases de Datos", etiqueta: "Práctica" },
  { dia: "LUNES", horaInicio: "11:00", horaFin: "13:00", modalidad: "VIRTUAL", materia: "Probabilidad y Estadística", etiqueta: "Teórica" },
  { dia: "MARTES", horaInicio: "09:00", horaFin: "11:00", modalidad: "PRESENCIAL", materia: "Estructura de Datos", etiqueta: "Práctica" },
  { dia: "MARTES", horaInicio: "15:00", horaFin: "17:00", modalidad: "PRESENCIAL", materia: "Matemática II" },
  { dia: "MIERCOLES", horaInicio: "08:00", horaFin: "10:00", modalidad: "VIRTUAL", materia: "Probabilidad y Estadística" },
  { dia: "JUEVES", horaInicio: "10:00", horaFin: "12:00", modalidad: "PRESENCIAL", materia: "Bases de Datos", etiqueta: "Teórica" },
  { dia: "VIERNES", horaInicio: "14:00", horaFin: "16:00", modalidad: "PRESENCIAL", materia: "Programación II" },
] as const;

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"] as const;

const MATERIAS_EJEMPLO: {
  id: string;
  codigo: string;
  nombre: string;
  estado: "CURSANDO" | "PARA_FINALIZAR" | "REGULAR" | "FINALIZADA";
  anio: number;
  cuatrimestre: number;
  profesor?: string;
}[] = [
  { id: "m1", codigo: "INF-403", nombre: "Bases de Datos", estado: "CURSANDO", anio: 2, cuatrimestre: 1, profesor: "Lic. Gómez" },
  { id: "m2", codigo: "INF-305", nombre: "Probabilidad y Estadística", estado: "CURSANDO", anio: 2, cuatrimestre: 1 },
  { id: "m3", codigo: "INF-206", nombre: "Estructura de Datos", estado: "CURSANDO", anio: 2, cuatrimestre: 2 },
  { id: "m4", codigo: "INF-104", nombre: "Matemática II", estado: "PARA_FINALIZAR", anio: 1, cuatrimestre: 2 },
  { id: "m5", codigo: "INF-102", nombre: "Programación II", estado: "REGULAR", anio: 1, cuatrimestre: 2 },
  { id: "m6", codigo: "INF-101", nombre: "Programación I", estado: "FINALIZADA", anio: 1, cuatrimestre: 1 },
];

const LINKS_EJEMPLO = [
  { id: "l1", nombre: "Campus Ucasal", categoria: "PLATAFORMA_UCASAL", favorito: true, url: "campus.ucasal.edu.ar" },
  { id: "l2", nombre: "Drive · Materias", categoria: "GOOGLE_DRIVE", favorito: true, url: "drive.google.com" },
  { id: "l3", nombre: "Repo UcaNode", categoria: "GITHUB", favorito: false, url: "github.com/lautioliver/UcaNode" },
  { id: "l4", nombre: "Biblioteca virtual", categoria: "OTRO", favorito: false, url: "biblioteca.ucasal.edu.ar" },
] as const;

const categoriaIcon: Record<string, ComponentType<{ className?: string }>> = {
  GOOGLE_DRIVE: HardDrive,
  PLATAFORMA_UCASAL: School,
  GITHUB: Code2,
  OTRO: Link2,
};

type PostPreview = {
  id: string;
  titulo: string;
  excerpt: string;
  anio: number;
  karma: number;
  hace: string;
  materia: string;
  votos: number;
  comentarios: number;
  adjunto?: string;
  tags?: string[];
};

const COMUNIDAD_EJEMPLO: PostPreview[] = [
  {
    id: "c1",
    titulo: "Parcial 1 resuelto — Sistemas Operativos (2024)",
    excerpt:
      "Subo el parcial del año pasado con respuestas comentadas. Incluye ejercicios de planificación y memoria virtual.",
    anio: 3,
    karma: 842,
    hace: "hace 2 h",
    materia: "Sistemas Operativos",
    votos: 40,
    comentarios: 8,
    adjunto: "SO_Parcial1_2024_resuelto.pdf",
    tags: ["Finales", "Parciales"],
  },
  {
    id: "c2",
    titulo: "¿Vale la pena promocionar Algoritmos o conviene rendir final?",
    excerpt:
      "El profe dijo que el TP final es exigente. ¿Alguien promocionó el cuatrimestre pasado? Quiero saber si conviene ir a final directo.",
    anio: 2,
    karma: 124,
    hace: "hace 5 h",
    materia: "Algoritmos y Estructuras de Datos",
    votos: 17,
    comentarios: 12,
    tags: ["Moodle"],
  },
  {
    id: "c4",
    titulo: "Carpeta compartida — Apuntes de Bases de Datos",
    excerpt:
      "Dejo el Drive con apuntes de normalización, SQL avanzado y modelos ER del profe anterior. Se actualiza semanalmente.",
    anio: 4,
    karma: 567,
    hace: "hace 1 d",
    materia: "Bases de Datos",
    votos: 54,
    comentarios: 3,
    adjunto: "Apuntes_BD_UCASAL_2026",
    tags: ["Moodle"],
  },
];

const CONCURRENCIA_EJEMPLO = [
  { id: "z1", nombre: "Biblioteca Central", capacidad: "Baja", ocupacion: 22, votos: 5, tendencia: [22, 18, 25, 30, 28, 35, 32, 26] },
  { id: "z2", nombre: "Buffet Facultad", capacidad: "Moderada", ocupacion: 55, votos: 9, tendencia: [40, 45, 50, 55, 58, 60, 56, 52] },
  { id: "z3", nombre: "Carritos de Comida", capacidad: "Alta", ocupacion: 80, votos: 14, tendencia: [60, 68, 75, 82, 87, 90, 85, 80] },
];

type ZonePreview = {
  id: string;
  nombre: string;
  capacidad: string;
  ocupacion: number;
  votos: number;
  tendencia: number[];
};

const SKIP_WORDS = new Set(["de", "del", "la", "las", "los", "y", "a", "en", "al", "ii", "iii", "iv", "v", "vi"]);

function materiaAbbr(nombre: string, codigo: string | null): string {
  const fromName = nombre
    .trim()
    .split(/\s+/)
    .filter((w) => !SKIP_WORDS.has(w.toLowerCase()))
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
  return fromName || codigo?.slice(0, 4) || "MAT";
}

function diasHasta(fecha: Date): number {
  const ahora = new Date();
  const ms = fecha.getTime() - ahora.getTime();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

const ROTACION_MS = 5000;

/** Preview interactivo de escritorio con varias vistas navegables. */
export function AppPreview({
  initialView = "dashboard",
  autoRotate = true,
}: {
  initialView?: ViewId;
  autoRotate?: boolean;
}) {
  const [view, setView] = useState<ViewId>(initialView);
  const [auto, setAuto] = useState(autoRotate);
  const [progress, setProgress] = useState(0);
  const hoverRef = useRef(false);

  // true solo en el cliente: evita hydration mismatch (fechas relativas a Date.now()).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!auto || !mounted) return;
    const STEP_MS = 100;
    const id = setInterval(() => {
      if (hoverRef.current) return;
      setProgress((prev) => {
        const next = prev + STEP_MS;
        if (next >= ROTACION_MS) {
          setView((v) => VIEWS[(VIEWS.indexOf(v) + 1) % VIEWS.length]);
          return 0;
        }
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [auto, mounted]);

  const select = (v: ViewId) => {
    setView(v);
    setProgress(0);
    setAuto(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-[var(--shadow-card-lg)]">
      {/* Barra de navegador */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-subtle px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <div className="ml-3 flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-border bg-surface-card px-3 py-1">
          <span className="text-[11px] text-muted">🔒</span>
          <span className="truncate text-[11px] text-secondary">
            uca-node.vercel.app/{VIEW_LABEL[view]}
          </span>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent-ghost px-2.5 py-1 text-[10px] font-medium text-accent sm:inline-flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Vista interactiva
        </span>
      </div>

      {/* Topbar de la app */}
      <div className="flex h-11 items-center gap-3 border-b border-border bg-surface px-3 sm:h-12 sm:px-4">
        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="flex h-8 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-surface-subtle px-2.5 text-[11px] text-muted">
            <Search className="h-3 w-3 shrink-0" />
            <span className="truncate">Buscar materias, entregas, links...</span>
            <kbd className="ml-auto rounded border border-border bg-surface-card px-1 py-px text-[9px] font-medium text-muted">
              Ctrl K
            </kbd>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-secondary sm:flex">
            <Sun className="h-3.5 w-3.5" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-secondary">
            <Bell className="h-3.5 w-3.5" />
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-border bg-surface-card px-2 py-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-ghost text-[9px] font-semibold text-accent">
              US
            </span>
            <span className="hidden text-[11px] font-medium text-primary sm:block">
              Usuario
            </span>
          </span>
        </div>
      </div>

      {/* Nav horizontal (móvil) */}
      <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface-nav px-2 py-1.5 md:hidden">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => select(id)}
            aria-current={view === id ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
              view === id
                ? "border-accent bg-accent-ghost text-accent"
                : "border-border bg-surface-card text-muted hover:text-primary"
            }`}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 border-r border-border bg-surface-nav p-3 md:block">
          <div className="mb-3 flex items-center gap-2 px-1.5">
            <LogoMark className="h-5 w-5 shrink-0" />
            <span className="text-[11px] font-semibold text-primary">UcaNode</span>
          </div>
          <nav className="space-y-0.5">
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => select(id)}
                aria-current={view === id ? "page" : undefined}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition ${
                  view === id
                    ? "bg-accent-ghost font-medium text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-4 hidden px-1.5 lg:block">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">
              Clic para explorar
            </p>
            <p className="text-[10px] leading-relaxed text-muted">
              Navegá entre las vistas como si estuvieras dentro de la app.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div
          className="flex min-w-0 flex-1 flex-col bg-surface"
          onMouseEnter={() => {
            hoverRef.current = true;
          }}
          onMouseLeave={() => {
            hoverRef.current = false;
          }}
        >
          <div className="relative">
            <div
              key={view}
              className="entregas-view-enter flex h-[30rem] min-h-0 flex-col space-y-4 overflow-x-clip overflow-y-auto p-3 sm:p-5 xl:h-[32rem]"
            >
              {!mounted ? (
                <PreviewSkeleton />
              ) : (
                <>
                  {view === "dashboard" && <DashboardView />}
                  {view === "entregas" && <EntregasView />}
                  {view === "horarios" && <HorariosView />}
                  {view === "materias" && <MateriasView />}
                  {view === "links" && <LinksView />}
                  {view === "comunidad" && <ComunidadView />}
                  {view === "concurrencia" && <ConcurrenciaView />}
                </>
              )}
            </div>

            {/* Barra de progreso de rotación */}
            {auto && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-surface-hover">
                <div
                  className="h-full rounded-r-full bg-accent transition-[width] duration-100 ease-linear"
                  style={{ width: `${(progress / ROTACION_MS) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Indicador de vista */}
          <div className="mt-auto flex items-center justify-center gap-1.5 border-t border-border bg-surface-subtle px-4 py-2.5">
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => select(v)}
                title={NAV.find((n) => n.id === v)?.label}
                aria-label={NAV.find((n) => n.id === v)?.label}
                className={`h-1.5 rounded-full transition-all ${
                  view === v ? "w-6 bg-accent" : "w-1.5 bg-muted hover:bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Placeholder mientras el preview se monta en el cliente (evita hydration mismatch). */
function PreviewSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="space-y-1.5">
        <div className="h-4 w-32 animate-pulse rounded-full bg-surface-hover" />
        <div className="h-5 w-48 animate-pulse rounded-lg bg-surface-hover" />
        <div className="h-3 w-72 max-w-full animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
      <div className="grid gap-2.5 md:grid-cols-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
    </div>
  );
}

function ViewHeader({
  pill,
  title,
  description,
  chips,
}: {
  pill: string;
  title: string;
  description: string;
  chips?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <span className="inline-flex items-center rounded-full border border-border bg-surface-card px-2.5 py-0.5 text-[10px] font-medium text-secondary">
          {pill}
        </span>
        <div>
          <p className="text-[15px] font-semibold text-primary">{title}</p>
          <p className="text-[11px] text-muted">{description}</p>
        </div>
      </div>
      {chips && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{chips}</div>}
    </div>
  );
}

function DashboardView() {
  const pendientes = ENTREGAS_EJEMPLO.filter((e) => e.estado !== "ENTREGADO");
  const urgentes = pendientes.filter((e) => diasHasta(new Date(e.fecha)) < 2);
  const enSemana = pendientes.filter((e) => {
    const d = diasHasta(new Date(e.fecha));
    return d >= 2 && d <= 7;
  });
  const aTiempo = pendientes.filter((e) => diasHasta(new Date(e.fecha)) > 7);
  const materiasCursando = MATERIAS_EJEMPLO.filter(
    (m) => m.estado === "CURSANDO" || m.estado === "PARA_FINALIZAR",
  ).length;
  const proximas = pendientes.slice(0, 4);

  return (
    <>
      <ViewHeader
        pill="Resumen semanal"
        title="Dashboard"
        description="Planificá tu semana con un vistazo a lo más importante."
        chips={<CounterChip count={pendientes.length} label="Entregas pendientes" tone="accent" />}
      />

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <StatCard
          title="Urgentes"
          value={urgentes.length}
          hint="Vencen en menos de 2 días"
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Esta semana"
          value={enSemana.length}
          hint="Próximos 7 días"
          tone="warning"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          title="A tiempo"
          value={aTiempo.length}
          hint="Con margen amplio"
          tone="success"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Materias activas"
          value={materiasCursando}
          hint="Cursando este semestre"
          tone="accent"
          icon={<BookOpen className="h-5 w-5" />}
        />
      </div>

      <SectionCard title="Próximas entregas">
        <div className="grid gap-2.5 md:grid-cols-2">
          {proximas.map((e) => (
            <EntregaCard key={e.id} entrega={e} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

const FILTROS_ENTREGAS = [
  { value: "TODOS", label: "Todos" },
  { value: "TP", label: "TP" },
  { value: "PARCIAL", label: "Parcial" },
  { value: "FINAL", label: "Final" },
] as const;

function EntregasView() {
  const [filtro, setFiltro] = useState<(typeof FILTROS_ENTREGAS)[number]["value"]>("TODOS");
  const filtradas =
    filtro === "TODOS"
      ? ENTREGAS_EJEMPLO
      : ENTREGAS_EJEMPLO.filter((e) => e.tipo === filtro);
  const pendientes = filtradas.filter((e) => e.estado !== "ENTREGADO");

  return (
    <>
      <ViewHeader
        pill="Todo lo que se acerca"
        title="Entregas"
        description="TPs, parciales y finales con su urgencia."
        chips={
          <>
            <CounterChip count={filtradas.length} label="Total" />
            <CounterChip count={pendientes.length} label="Pendientes" tone="warning" />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS_ENTREGAS.map((f) => (
          <FilterPill
            key={f.value}
            active={filtro === f.value}
            onClick={() => setFiltro(f.value)}
            type="button"
          >
            {f.label}
          </FilterPill>
        ))}
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        {filtradas.map((e) => (
          <EntregaCard key={e.id} entrega={e} />
        ))}
      </div>
    </>
  );
}

function HorariosView() {
  const total = HORARIOS_EJEMPLO.length;
  const presencial = HORARIOS_EJEMPLO.filter((h) => h.modalidad === "PRESENCIAL").length;
  const virtual = total - presencial;

  return (
    <>
      <ViewHeader
        pill="Tu semana en un vistazo"
        title="Horarios"
        description="Clases presenciales y virtuales, día por día."
        chips={
          <>
            <CounterChip count={total} label="Clases" tone="accent" />
            <CounterChip count={presencial} label="Presenciales" tone="success" />
            <CounterChip count={virtual} label="Virtuales" tone="accent" />
          </>
        }
      />

      <div className="grid min-w-0 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {DIAS.map((dia) => {
          const items = HORARIOS_EJEMPLO.filter((h) => h.dia === dia);
          const esHoy = dia === "MARTES";
          return (
            <div
              key={dia}
              className={`rounded-xl border p-3 ${
                esHoy ? "border-accent bg-accent-ghost/30" : "border-border bg-surface-card"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">
                  {diaSemanaLabel[dia]}
                </p>
                {esHoy && (
                  <span className="rounded-full bg-accent-ghost px-1.5 py-px text-[9px] font-medium uppercase tracking-wider text-accent">
                    Hoy
                  </span>
                )}
              </div>
              {items.length > 0 ? (
                <div className="space-y-1.5">
                  {items.map((h, i) => {
                    const presencialClase = h.modalidad === "PRESENCIAL";
                    return (
                      <div
                        key={`${dia}-${i}`}
                        className="rounded-lg border border-border bg-surface px-2.5 py-1.5"
                      >
                        <p className="truncate text-[11px] font-medium leading-snug text-primary">
                          {h.materia}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] text-secondary">
                            <Clock className="h-2.5 w-2.5" />
                            {h.horaInicio}–{h.horaFin}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[9px] font-medium ${
                              presencialClase
                                ? "bg-success-ghost text-success"
                                : "bg-accent-ghost text-accent"
                            }`}
                          >
                            {presencialClase ? (
                              <MapPin className="h-2 w-2" />
                            ) : (
                              <Video className="h-2 w-2" />
                            )}
                            {modalidadLabel[h.modalidad]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border bg-surface-subtle px-2 py-3 text-center text-[10px] text-muted">
                  Sin clases
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function MateriasView() {
  const counts = {
    cursando: MATERIAS_EJEMPLO.filter((m) => m.estado === "CURSANDO").length,
    porFinalizar: MATERIAS_EJEMPLO.filter((m) => m.estado === "PARA_FINALIZAR").length,
    regular: MATERIAS_EJEMPLO.filter((m) => m.estado === "REGULAR").length,
    finalizada: MATERIAS_EJEMPLO.filter((m) => m.estado === "FINALIZADA").length,
  };

  return (
    <>
      <ViewHeader
        pill="Tu plan de materias"
        title="Materias"
        description="Organizá tu plan de estudios y su estado."
        chips={
          <>
            <CounterChip count={counts.cursando} label="Cursando" tone="accent" />
            <CounterChip count={counts.porFinalizar} label="Para finalizar" tone="warning" />
            <CounterChip count={counts.finalizada} label="Finalizadas" tone="success" />
          </>
        }
      />

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {MATERIAS_EJEMPLO.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-border bg-surface-card p-3 transition hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-ghost text-[10px] font-semibold text-accent">
                {materiaAbbr(m.nombre, m.codigo)}
              </span>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-medium ${
                  m.estado === "CURSANDO"
                    ? "border-[color:var(--accent)]/30 bg-accent-ghost text-accent"
                    : m.estado === "PARA_FINALIZAR"
                      ? "border-[color:var(--warning)]/30 bg-warning-ghost text-warning"
                      : m.estado === "REGULAR"
                        ? "border-[color:var(--accent)]/30 bg-accent-ghost text-accent"
                        : "border-[color:var(--success)]/30 bg-success-ghost text-success"
                }`}
              >
                {estadoMateriaLabel[m.estado]}
              </span>
            </div>
            <p className="mt-2.5 truncate text-xs font-semibold text-primary">
              {m.nombre}
            </p>
            <p className="mt-0.5 text-[10px] text-muted">
              {m.codigo} · {m.anio}° año{m.cuatrimestre ? ` · ${m.cuatrimestre}° cuat` : ""}
            </p>
            {m.profesor && (
              <p className="mt-1 truncate text-[10px] text-secondary">{m.profesor}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const FILTROS_LINKS = [
  { value: "TODOS", label: "Todos" },
  { value: "PLATAFORMA_UCASAL", label: "Ucasal" },
  { value: "GOOGLE_DRIVE", label: "Drive" },
  { value: "GITHUB", label: "GitHub" },
  { value: "OTRO", label: "Otros" },
] as const;

function LinksView() {
  const [filtro, setFiltro] = useState<(typeof FILTROS_LINKS)[number]["value"]>("TODOS");
  const filtrados =
    filtro === "TODOS"
      ? LINKS_EJEMPLO
      : LINKS_EJEMPLO.filter((l) => l.categoria === filtro);
  const favoritos = LINKS_EJEMPLO.filter((l) => l.favorito).length;

  return (
    <>
      <ViewHeader
        pill="Todos tus atajos"
        title="Links"
        description="Campus, Drive, GitHub y tus recursos favoritos."
        chips={
          <>
            <CounterChip count={LINKS_EJEMPLO.length} label="Total" tone="accent" />
            <CounterChip count={favoritos} label="Favoritos" tone="warning" />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS_LINKS.map((f) => (
          <FilterPill
            key={f.value}
            active={filtro === f.value}
            onClick={() => setFiltro(f.value)}
            type="button"
          >
            {f.label}
          </FilterPill>
        ))}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtrados.map((l) => {
          const Icon = categoriaIcon[l.categoria];
          return (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3 transition hover:border-border-strong"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-ghost text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-primary">{l.nombre}</p>
                <p className="flex items-center gap-1 truncate text-[10px] text-muted">
                  <span className="inline-flex h-3 w-3 items-center justify-center">
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                  <span className="truncate">{l.url}</span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="rounded-full border border-border bg-surface px-1.5 py-px text-[8px] font-medium text-secondary">
                  {categoriaLinkLabel[l.categoria as keyof typeof categoriaLinkLabel]}
                </span>
                {l.favorito && (
                  <Star className="h-3 w-3 fill-warning text-warning" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const FILTROS_COMUNIDAD = [
  { value: "todo", label: "Todo" },
  { value: "carrera", label: "Mi carrera" },
  { value: "materias", label: "Mis materias" },
  { value: "archivos", label: "Apuntes y archivos" },
] as const;

type FiltroComunidad = (typeof FILTROS_COMUNIDAD)[number]["value"];

function ComunidadView() {
  const [filtro, setFiltro] = useState<FiltroComunidad>("todo");
  const visibles =
    filtro === "archivos"
      ? COMUNIDAD_EJEMPLO.filter((p) => p.adjunto)
      : COMUNIDAD_EJEMPLO;
  const totalVotos = COMUNIDAD_EJEMPLO.reduce((acc, p) => acc + p.votos, 0);

  return (
    <>
      <ViewHeader
        pill="Foro estudiantil"
        title="Comunidad"
        description="Compartí apuntes, resolvé dudas y seguí lo que pasa en tu carrera."
        chips={
          <>
            <CounterChip count={COMUNIDAD_EJEMPLO.length} label="Posts" tone="accent" />
            <CounterChip count={totalVotos} label="↑ Total" tone="success" />
          </>
        }
      />

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
        {FILTROS_COMUNIDAD.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFiltro(t.value)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
              filtro === t.value
                ? "bg-accent text-white"
                : "text-secondary hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-2.5">
          {visibles.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-border bg-surface-card p-3.5 shadow-[var(--shadow-card)] transition hover:border-border-strong"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-accent-ghost px-2 py-0.5 text-[10px] font-medium text-accent">
                  #{p.materia}
                </span>
                {p.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-2 py-0.5 text-[9px] font-medium text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-2.5 flex min-w-0 items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-ghost text-accent">
                  <Users className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span className="rounded-full border border-border bg-surface px-1.5 py-px text-[9px] font-medium text-secondary">
                      {p.anio}.º año
                    </span>
                    <span className="text-[10px] text-muted">
                      {p.karma} karma · {p.hace}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold leading-snug text-primary">
                    {p.titulo}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-secondary">
                    {p.excerpt}
                  </p>
                  {p.adjunto && (
                    <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-[10px] text-secondary">
                      <FileText className="h-3 w-3 shrink-0 text-accent" />
                      <span className="truncate">{p.adjunto}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                  <ChevronUp className="h-3 w-3" />
                  {p.votos}
                  <ChevronDown className="h-3 w-3" />
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <MessageSquare className="h-3 w-3" />
                  {p.comentarios} comentarios
                </span>
              </div>
            </article>
          ))}
        </div>

        <aside className="w-full shrink-0 space-y-3 lg:w-56">
          <div className="rounded-xl border border-border bg-surface-card p-3 shadow-[var(--shadow-card)]">
            <p className="mb-2 text-[11px] font-semibold text-primary">Top recursos</p>
            <ul className="space-y-1.5">
              {COMUNIDAD_EJEMPLO.slice(0, 3).map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-start gap-2 rounded-lg border border-border bg-surface px-2 py-1.5"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-ghost text-[9px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-primary">
                      {p.titulo}
                    </p>
                    <p className="truncate text-[9px] text-muted">
                      {p.materia} · ↑ {p.votos}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface-card p-3 shadow-[var(--shadow-card)]">
            <p className="mb-2 text-[11px] font-semibold text-primary">Tendencias</p>
            <div className="flex flex-wrap gap-1.5">
              {["Finales", "Moodle", "Inscrip"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const zonaEstadoTone: Record<string, "success" | "warning" | "danger"> = {
  Verde: "success",
  Amarillo: "warning",
  Rojo: "danger",
};

function statusOf(zone: ZonePreview): "Verde" | "Amarillo" | "Rojo" {
  if (zone.ocupacion >= 75) return "Rojo";
  if (zone.ocupacion >= 40) return "Amarillo";
  return "Verde";
}

function TrendSparkline({ trend }: { trend: readonly number[] }) {
  const max = Math.max(...trend, 1);
  return (
    <div className="flex h-8 items-end gap-1 rounded-lg border border-border bg-surface px-2 py-1.5">
      {trend.map((value, index) => {
        const height = Math.max(14, Math.round((value / max) * 100));
        return (
          <div
            key={`${value}-${index}`}
            className="flex-1 rounded-sm bg-accent/70"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function ConcurrenciaView() {
  const rojas = CONCURRENCIA_EJEMPLO.filter((z) => statusOf(z) === "Rojo").length;
  const amarillas = CONCURRENCIA_EJEMPLO.filter(
    (z) => statusOf(z) === "Amarillo",
  ).length;

  return (
    <>
      <ViewHeader
        pill="Campus en vivo"
        title="Concurrencia"
        description="Consultá la ocupación del campus en tiempo real gracias a CampuStatus."
        chips={
          <>
            <CounterChip count={CONCURRENCIA_EJEMPLO.length} label="Zonas" tone="accent" />
            <CounterChip count={rojas} label="En rojo" tone="danger" />
            <CounterChip count={amarillas} label="En amarillo" tone="warning" />
          </>
        }
      />

      <div className="grid min-w-0 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {CONCURRENCIA_EJEMPLO.map((z) => {
          const status = statusOf(z);
          const tone = zonaEstadoTone[status];
          return (
            <div
              key={z.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface-card p-3.5 shadow-[var(--shadow-card)] transition hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-[13px] font-semibold text-primary">
                    {z.nombre}
                  </p>
                  <p className="text-[10px] text-muted">
                    Capacidad {z.capacidad.toLowerCase()}
                  </p>
                </div>
                <StatusBadge tone={tone} className="shrink-0">
                  {status}
                </StatusBadge>
              </div>

              <ProgressBar value={z.ocupacion} tone={tone} label="Ocupación" />

              <div className="space-y-1.5">
                <p className="text-[9px] font-medium uppercase tracking-wider text-muted">
                  Tendencia reciente
                </p>
                <TrendSparkline trend={z.tendencia} />
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-secondary">
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Actualizado 14:32
                </span>
                <span className="text-muted">·</span>
                <span>
                  {z.votos} reporte{z.votos === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
