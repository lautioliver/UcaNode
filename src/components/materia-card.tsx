import Link from "next/link";
import { EstadoMateria } from "@/generated/prisma/client";
import { estadoMateriaColor, estadoMateriaLabel } from "@/lib/labels";

type MateriaItem = {
  id: string;
  nombre: string;
  codigo: string | null;
  estado: EstadoMateria;
  profesor: string | null;
  semestre: string | null;
};

export function MateriaCard({ materia }: { materia: MateriaItem }) {
  return (
    <Link
      href={`/materias/${materia.id}`}
      className="block rounded-lg border border-border bg-surface p-3 transition hover:border-border-accent hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-primary">{materia.nombre}</p>
          {materia.codigo && (
            <p className="mt-0.5 text-xs text-muted">{materia.codigo}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${estadoMateriaColor[materia.estado]}`}
        >
          {estadoMateriaLabel[materia.estado]}
        </span>
      </div>
      {(materia.profesor || materia.semestre) && (
        <p className="mt-2 text-xs text-muted">
          {[materia.semestre, materia.profesor].filter(Boolean).join(" · ")}
        </p>
      )}
    </Link>
  );
}

export function MateriaList({ materias }: { materias: MateriaItem[] }) {
  if (materias.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {materias.map((materia) => (
        <MateriaCard key={materia.id} materia={materia} />
      ))}
    </div>
  );
}
