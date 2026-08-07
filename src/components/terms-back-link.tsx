"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function TermsBackLink() {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (typeof window !== "undefined" && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  }

  return (
    <Link
      href="/login"
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-secondary transition hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver
    </Link>
  );
}
