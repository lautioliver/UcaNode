import Link from "next/link";

const input =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-accent focus:ring-2 focus:ring-accent/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}


export function LoginForm({
  next,
  error,
}: {
  next?: string;
  error?: string;
}) {
  return (
    <form action="/api/auth/login" method="POST" className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className={input}
        />
      </Field>
      <Field label="Contraseña">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Tu contraseña"
          className={input}
        />
      </Field>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
      >
        Iniciar sesión
      </button>
      {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
      <p className="text-center text-xs text-muted">
        ¿No tenés cuenta?{" "}
        <Link
          href={next ? `/registro?next=${encodeURIComponent(next)}` : "/registro"}
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
        >
          Crear una
        </Link>
      </p>
    </form>
  );
}

export function RegistroForm({
  next,
  error,
}: {
  next?: string;
  error?: string;
}) {
  return (
    <form action="/api/auth/registro" method="POST" className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Nombre">
        <input
          name="nombre"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          className={input}
        />
      </Field>
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className={input}
        />
      </Field>
      <Field label="Contraseña">
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          className={input}
        />
      </Field>
      <Field label="Confirmar contraseña">
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repetí la contraseña"
          className={input}
        />
      </Field>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
      >
        Crear cuenta
      </button>
      {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
      <p className="text-center text-xs text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="text-secondary underline-offset-2 transition hover:text-primary hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}

