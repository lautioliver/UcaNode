import Link from "next/link";

export default function MateriaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-lg font-semibold text-secondary">Materia no encontrada</p>
      <p className="text-sm text-muted">
        La materia que buscás no existe o fue eliminada.
      </p>
      <Link
        href="/materias"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Volver a materias
      </Link>
    </div>
  );
}
