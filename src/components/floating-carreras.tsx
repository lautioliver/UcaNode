"use client";

import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import { CarreraIcon } from "@/components/carrera-icons";
import { cn } from "@/lib/utils";

/** Solo laterales del viewport: órbita amplia, zona central libre para el formulario. */
const FLOAT_STYLES = [
  {
    className:
      "carrera-float-a left-[max(0.5rem,3vw)] top-[12%] md:left-[4%] lg:left-[6%] xl:left-[8%]",
    delay: "0s",
    duration: "24s",
  },
  {
    className:
      "carrera-float-b right-[max(0.5rem,3vw)] top-[16%] md:right-[4%] lg:right-[6%] xl:right-[8%]",
    delay: "-5s",
    duration: "27s",
  },
  {
    className:
      "carrera-float-c left-[max(0.5rem,4vw)] top-[42%] md:left-[5%] lg:left-[7%] xl:left-[9%]",
    delay: "-10s",
    duration: "25s",
  },
  {
    className:
      "carrera-float-d right-[max(0.5rem,4vw)] top-[48%] md:right-[5%] lg:right-[7%] xl:right-[9%]",
    delay: "-7s",
    duration: "29s",
  },
  {
    className:
      "carrera-float-e left-[max(0.5rem,5vw)] bottom-[14%] md:left-[3%] lg:left-[5%] xl:left-[7%]",
    delay: "-13s",
    duration: "26s",
  },
] as const;

export function FloatingCarreras({ carreras }: { carreras: CarreraCatalogo[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      <div className="absolute inset-y-[8%] left-1/2 w-[min(100%,26rem)] -translate-x-1/2 rounded-[2rem] bg-surface/85 blur-2xl sm:w-[28rem] md:bg-surface/70 lg:w-[32rem]" />

      {carreras.map((carrera, index) => {
        const style = FLOAT_STYLES[index % FLOAT_STYLES.length];
        return (
          <div
            key={carrera.slug}
            className={cn("carrera-float absolute w-max max-w-[min(42vw,18rem)]", style.className)}
            style={{
              animationDelay: style.delay,
              animationDuration: style.duration,
            }}
          >
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-surface-card/90 px-3.5 py-3 shadow-[var(--shadow-card)] backdrop-blur-sm">
              <CarreraIcon carrera={carrera} className="mt-0.5 h-9 w-9" />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-primary">{carrera.nombre}</p>
                <p className="mt-0.5 text-xs text-muted">Plan {carrera.planAnio}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
