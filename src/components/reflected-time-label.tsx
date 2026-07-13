"use client";

import { useSyncExternalStore } from "react";
import { formatReflectedTime } from "@/lib/campustatus/utils";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ReflectedTimeLabel({ iso }: { iso: string }) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return <>—</>;
  }

  return <>{formatReflectedTime(iso)}</>;
}
