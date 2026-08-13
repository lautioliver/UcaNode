"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

const MAX_TILT = 7;

const subscribe = () => () => {};

function readFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

/** Envuelve contenido en una tarjeta que rota en 3D siguiendo el cursor. */
export function TiltCard({
  children,
  className = "",
  maxTilt = MAX_TILT,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(subscribe, readFinePointer, () => false);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(0)`;
    },
    [enabled, maxTilt],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1400px) rotateX(2deg) rotateY(-3deg) translateZ(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: enabled ? "perspective(1400px) rotateX(2deg) rotateY(-3deg)" : undefined,
        transformStyle: "preserve-3d",
        transition: "transform 0.18s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
