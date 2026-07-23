import { LogoMark } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex min-h-screen flex-col bg-surface px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="text-base font-semibold text-primary">UcaNode</p>
            <p className="text-xs text-muted">Autogestión Ucasal</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-secondary">{description}</p>
          </div>

          <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card)]">
            <CardContent className="p-5 sm:p-6">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
