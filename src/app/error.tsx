"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
      <p className="text-lg font-semibold text-danger">Algo salió mal</p>
      <p className="text-sm text-muted">
        Ocurrió un error inesperado. Intentá de nuevo.
      </p>
      <Button onClick={() => unstable_retry()}>Reintentar</Button>
    </div>
  );
}
