import Link from "next/link";
import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { ChangelogContent } from "@/components/changelog-content";
import { TermsBackLink } from "@/components/terms-back-link";
import { Card, CardContent } from "@/components/ui/card";
import { CHANGELOG_META } from "@/content/changelog";

export const metadata: Metadata = {
  title: "Novedades — UcaNode",
  description: CHANGELOG_META.subtitle,
};

export default function NovedadesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-4 flex flex-col items-center gap-2">
              <LogoMark className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-base font-semibold text-primary">UcaNode</p>
                <p className="text-xs text-muted">Autogestión Ucasal</p>
              </div>
            </Link>
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1 text-[11px] font-medium text-secondary shadow-[var(--shadow-card)]">
              <Megaphone className="h-3.5 w-3.5 text-accent" />
              Changelog
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {CHANGELOG_META.title}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-secondary">
              {CHANGELOG_META.subtitle}
            </p>
          </div>

          <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card-lg)]">
            <CardContent className="p-5 sm:p-8">
              <ChangelogContent />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <TermsBackLink />
          </div>
        </div>
      </main>
    </div>
  );
}
