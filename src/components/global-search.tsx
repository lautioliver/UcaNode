"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  Link2,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { buscarGlobal, type BusquedaResultados } from "@/lib/search";
import { estadoMateriaLabel, tipoEntregaLabel } from "@/lib/labels";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/materias", label: "Materias", Icon: BookOpen },
  { href: "/entregas", label: "Entregas", Icon: ClipboardCheck },
  { href: "/analytics", label: "Analíticas", Icon: BarChart3 },
  { href: "/horarios", label: "Horarios", Icon: CalendarDays },
  { href: "/concurrencia", label: "Concurrencia", Icon: Users },
  { href: "/links", label: "Links", Icon: Link2 },
  { href: "/perfil", label: "Perfil", Icon: Users },
];

const DEBOUNCE_MS = 250;
const MIN_QUERY = 2;

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

export function GlobalSearch({
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const [query, setQuery] = useState("");
  // Última respuesta junto con la query que la generó: permite derivar
  // "buscando" y descartar resultados viejos sin setState dentro de efectos.
  const [respuesta, setRespuesta] = useState<{
    query: string;
    data: BusquedaResultados;
  } | null>(null);

  function handleOpenChange(next: boolean) {
    setDialogOpen(next);
    if (!next) {
      setQuery("");
      setRespuesta(null);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleOpenChange(!dialogOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY) return;

    let cancelado = false;
    const timer = setTimeout(async () => {
      let data: BusquedaResultados;
      try {
        data = await buscarGlobal(q);
      } catch {
        data = { materias: [], entregas: [], links: [] };
      }
      if (!cancelado) setRespuesta({ query: q, data });
    }, DEBOUNCE_MS);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [query]);

  function go(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  const qTrim = query.trim();
  const q = normalizar(qTrim);
  const navFiltrado = q
    ? NAV_ITEMS.filter((item) => normalizar(item.label).includes(q))
    : NAV_ITEMS;

  const busquedaActiva = qTrim.length >= MIN_QUERY;
  const resultados =
    busquedaActiva && respuesta?.query === qTrim ? respuesta.data : null;
  const buscando = busquedaActiva && resultados === null;

  const materias = resultados?.materias ?? [];
  const entregas = resultados?.entregas ?? [];
  const links = resultados?.links ?? [];
  const sinResultados =
    !buscando &&
    navFiltrado.length === 0 &&
    materias.length === 0 &&
    entregas.length === 0 &&
    links.length === 0;

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-border bg-surface-card px-3 text-sm text-muted transition hover:border-border-strong hover:text-secondary"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">Buscar materias, entregas, links...</span>
          <kbd className="hidden rounded-md border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline">
            Ctrl K
          </kbd>
        </button>
      )}

      <CommandDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        title="Buscar en UcaNode"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Buscar materias, entregas, links o secciones..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {buscando && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando...
            </div>
          )}

          {sinResultados && <CommandEmpty>Sin resultados.</CommandEmpty>}

          {navFiltrado.length > 0 && (
            <CommandGroup heading="Secciones">
              {navFiltrado.map(({ href, label, Icon }) => (
                <CommandItem key={href} value={href} onSelect={() => go(href)}>
                  <Icon className="h-4 w-4 text-accent" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {materias.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Materias">
                {materias.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={`materia-${m.id}`}
                    onSelect={() => go(`/materias/${m.id}`)}
                  >
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span className="min-w-0 flex-1 truncate">
                      {m.nombre}
                      {m.codigo && <span className="text-muted"> · {m.codigo}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {estadoMateriaLabel[m.estado]}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {entregas.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Entregas">
                {entregas.map((e) => (
                  <CommandItem
                    key={e.id}
                    value={`entrega-${e.id}`}
                    onSelect={() => go(`/entregas?q=${encodeURIComponent(e.titulo)}`)}
                  >
                    <ClipboardCheck className="h-4 w-4 text-accent" />
                    <span className="min-w-0 flex-1 truncate">
                      {e.titulo}
                      <span className="text-muted"> · {e.materiaNombre}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {tipoEntregaLabel[e.tipo]} · {formatFecha(e.fecha)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {links.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Links">
                {links.map((l) => (
                  <CommandItem
                    key={l.id}
                    value={`link-${l.id}`}
                    onSelect={() => {
                      handleOpenChange(false);
                      window.open(l.url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Link2 className="h-4 w-4 text-accent" />
                    <span className="min-w-0 flex-1 truncate">{l.nombre}</span>
                    <span className="max-w-[40%] shrink-0 truncate text-xs text-muted">
                      {l.url.replace(/^https?:\/\//, "")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}