import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoEntrega, TipoEntrega } from "@/generated/prisma/client";
import {
  estadoEntregaLabel,
  tipoEntregaColor,
  tipoEntregaLabel,
} from "@/lib/labels";

type EntregaItem = {
  id: string;
  titulo: string;
  tipo: TipoEntrega;
  fecha: Date;
  estado: EstadoEntrega;
  materia: { nombre: string };
};

export function EntregaRow({ entrega }: { entrega: EntregaItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-100">{entrega.titulo}</p>
        <p className="truncate text-xs text-zinc-500">{entrega.materia.nombre}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tipoEntregaColor[entrega.tipo]}`}
        >
          {tipoEntregaLabel[entrega.tipo]}
        </span>
        <span className="text-xs text-zinc-400">
          {format(entrega.fecha, "d MMM yyyy", { locale: es })}
        </span>
        <span className="text-[10px] text-zinc-600">
          {estadoEntregaLabel[entrega.estado]}
        </span>
      </div>
    </div>
  );
}

export function CalendarioMes({
  entregas,
}: {
  entregas: EntregaItem[];
}) {
  const byDate = entregas.reduce<Record<string, EntregaItem[]>>((acc, e) => {
    const key = format(e.fecha, "yyyy-MM-dd");
    acc[key] = acc[key] ?? [];
    acc[key].push(e);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  if (dates.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
        No hay entregas programadas. Agregá TP, parciales o finales desde Entregas.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            {format(new Date(date + "T12:00:00"), "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <div className="space-y-2">
            {byDate[date].map((entrega) => (
              <EntregaRow key={entrega.id} entrega={entrega} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
