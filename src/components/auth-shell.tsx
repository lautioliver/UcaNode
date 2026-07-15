export function AuthPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-secondary">{description}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-[var(--shadow-card)] sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
