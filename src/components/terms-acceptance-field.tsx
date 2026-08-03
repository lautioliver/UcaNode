"use client";

import Link from "next/link";

export function TermsAcceptanceField({ required = false }: { required?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-0.5">
      <input
        type="checkbox"
        name="acceptTerms"
        value="on"
        required={required}
        className="mt-0.5 size-3.5 shrink-0 rounded-[4px] border-border-strong bg-surface-card text-accent accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-border dark:bg-surface-hover"
      />
      <span className="text-xs leading-relaxed text-muted">
        Acepto los{" "}
        <Link
          href="/terminos-y-condiciones"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          Términos y Condiciones
        </Link>
      </span>
    </label>
  );
}
