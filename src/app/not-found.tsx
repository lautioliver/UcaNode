import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-lg font-semibold text-secondary">Página no encontrada</p>
      <p className="text-sm text-muted">
        La página que buscás no existe.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Volver al dashboard
      </Link>
    </div>
  );
}
