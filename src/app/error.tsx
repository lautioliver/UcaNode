"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-lg font-semibold text-red-500">Algo salió mal</p>
      <p className="text-sm text-muted">
        Ocurrió un error inesperado. Intentá de nuevo.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Reintentar
      </button>
    </div>
  );
}
