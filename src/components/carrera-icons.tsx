import type { ComponentType } from "react";
import {
  Brain,
  Building2,
  Cpu,
  Factory,
  HardHat,
  type LucideProps,
} from "lucide-react";
import type { CarreraCatalogo } from "@/lib/planes-estudio/types";
import { cn } from "@/lib/utils";

type CarreraVisual = {
  Icon: ComponentType<LucideProps>;
  iconClassName: string;
  badgeClassName: string;
};

const CARRERA_VISUALS: Record<string, CarreraVisual> = {
  "ingenieria-informatica-2015": {
    Icon: Cpu,
    iconClassName: "text-sky-500",
    badgeClassName: "bg-sky-500/12 ring-sky-500/25",
  },
  "ingenieria-industrial-2005": {
    Icon: Factory,
    iconClassName: "text-amber-500",
    badgeClassName: "bg-amber-500/12 ring-amber-500/25",
  },
  "licenciatura-en-psicologia-1114": {
    Icon: Brain,
    iconClassName: "text-violet-500",
    badgeClassName: "bg-violet-500/12 ring-violet-500/25",
  },
  "arquitectura-2015": {
    Icon: Building2,
    iconClassName: "text-rose-500",
    badgeClassName: "bg-rose-500/12 ring-rose-500/25",
  },
  "ingenieria-civil-2012": {
    Icon: HardHat,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/12 ring-emerald-500/25",
  },
};

const DEFAULT_VISUAL: CarreraVisual = {
  Icon: Building2,
  iconClassName: "text-accent",
  badgeClassName: "bg-accent-ghost ring-accent/20",
};

export function getCarreraVisual(slug: string): CarreraVisual {
  return CARRERA_VISUALS[slug] ?? DEFAULT_VISUAL;
}

export function CarreraIcon({
  carrera,
  className,
  iconClassName,
}: {
  carrera: Pick<CarreraCatalogo, "slug">;
  className?: string;
  iconClassName?: string;
}) {
  const visual = getCarreraVisual(carrera.slug);
  const Icon = visual.Icon;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
        visual.badgeClassName,
        className,
      )}
    >
      <Icon className={cn("h-4 w-4", visual.iconClassName, iconClassName)} />
    </span>
  );
}
