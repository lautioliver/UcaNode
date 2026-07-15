"use client";

import { useCallback, useEffect, useState } from "react";

export function VerificarEmailContinuar({
  email,
  next = "/",
}: {
  email?: string;
  next?: string;
}) {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const safeNext = next || "/";

  const checkStatus = useCallback(async () => {
    if (!email) return false;

    const params = new URLSearchParams({ email });
    const res = await fetch(`/api/auth/estado-verificacion?${params}`);
    if (!res.ok) return false;

    const data = (await res.json()) as { verified: boolean };
    setVerified(data.verified);
    return data.verified;
  }, [email]);

  useEffect(() => {
    if (!email) return;

    void checkStatus();
    const interval = setInterval(() => {
      void checkStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [email, checkStatus]);

  async function handleContinuar() {
    if (!email) return;

    setChecking(true);
    setInlineError(null);

    const isVerified = await checkStatus();
    if (!isVerified) {
      setInlineError(
        "Todavía no verificaste tu email. Revisá tu bandeja de entrada. Si verificaste en otro dispositivo, iniciá sesión con tu contraseña.",
      );
      setChecking(false);
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/continuar-verificacion";

    const emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "email";
    emailInput.value = email;
    form.appendChild(emailInput);

    const nextInput = document.createElement("input");
    nextInput.type = "hidden";
    nextInput.name = "next";
    nextInput.value = safeNext;
    form.appendChild(nextInput);

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        onClick={() => void handleContinuar()}
        disabled={checking || !email}
        className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {checking ? "Verificando…" : verified ? "Continuar" : "Continuar"}
      </button>

      {verified && !inlineError ? (
        <p className="text-center text-xs text-accent">
          Email verificado. Podés continuar.
        </p>
      ) : null}

      {inlineError ? (
        <p className="text-center text-sm text-danger">{inlineError}</p>
      ) : null}
    </div>
  );
}
