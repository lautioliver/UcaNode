/**
 * Salta no tiene horario de verano, así que fijar la zona alcanza para que el
 * cálculo de "próxima clase" no dependa de la zona del servidor.
 */
export const TIMEZONE_CAMPUS = "America/Argentina/Buenos_Aires";

/**
 * Espeja los valores del enum `DiaSemana` de Prisma sin importarlo: este módulo
 * también se usa desde componentes de cliente, donde el client de Prisma no
 * puede entrar al bundle.
 */
export type DiaCampus = "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES";

const DIA_POR_NOMBRE: Record<string, DiaCampus> = {
  Monday: "LUNES",
  Tuesday: "MARTES",
  Wednesday: "MIERCOLES",
  Thursday: "JUEVES",
  Friday: "VIERNES",
};

export type MomentoCampus = {
  dia: DiaCampus | null;
  /** Minutos transcurridos desde la medianoche en la zona del campus. */
  minutos: number;
};

export function momentoCampus(date: Date = new Date()): MomentoCampus {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE_CAMPUS,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  const hora = Number(valor("hour"));
  const minuto = Number(valor("minute"));

  return {
    dia: DIA_POR_NOMBRE[valor("weekday")] ?? null,
    minutos: (Number.isNaN(hora) ? 0 : hora) * 60 + (Number.isNaN(minuto) ? 0 : minuto),
  };
}

/** Convierte "HH:MM" en minutos desde medianoche. Devuelve null si no parsea. */
export function minutosDeHora(hora: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hora.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

type HorarioBase = {
  dia: DiaCampus | string;
  horaInicio: string;
  horaFin: string;
};

export type ClaseDestacada<T extends HorarioBase> = {
  horario: T;
  estado: "EN_CURSO" | "PROXIMA";
  /** Minutos hasta que empieza (PROXIMA) o hasta que termina (EN_CURSO). */
  minutos: number;
};

/**
 * Devuelve la clase de hoy que está en curso o, si no hay ninguna, la siguiente
 * que arranca. Ignora las clases que ya terminaron y las de otros días.
 */
export function claseDestacada<T extends HorarioBase>(
  horarios: T[],
  momento: MomentoCampus = momentoCampus(),
): ClaseDestacada<T> | null {
  if (!momento.dia) return null;

  const candidatas = horarios
    .filter((horario) => horario.dia === momento.dia)
    .map((horario) => ({
      horario,
      inicio: minutosDeHora(horario.horaInicio),
      fin: minutosDeHora(horario.horaFin),
    }))
    .filter(
      (item): item is { horario: T; inicio: number; fin: number } =>
        item.inicio !== null && item.fin !== null,
    )
    .sort((a, b) => a.inicio - b.inicio);

  const enCurso = candidatas.find(
    (item) => item.inicio <= momento.minutos && momento.minutos < item.fin,
  );
  if (enCurso) {
    return {
      horario: enCurso.horario,
      estado: "EN_CURSO",
      minutos: enCurso.fin - momento.minutos,
    };
  }

  const proxima = candidatas.find((item) => item.inicio > momento.minutos);
  if (proxima) {
    return {
      horario: proxima.horario,
      estado: "PROXIMA",
      minutos: proxima.inicio - momento.minutos,
    };
  }

  return null;
}

/** "en 25 min", "en 2 h 10 min". */
export function formatearEspera(minutos: number): string {
  if (minutos <= 0) return "ahora";
  if (minutos < 60) return `en ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `en ${horas} h` : `en ${horas} h ${resto} min`;
}
