import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import {
  TERMS_META,
  TERMS_SECTIONS,
  type TermsSection,
} from "@/content/terminos-y-condiciones";

export const metadata: Metadata = {
  title: "Términos y Condiciones — UcaNode",
};

function TermsBlock({ section }: { section: TermsSection }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-primary">{section.title}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-secondary">
          {paragraph}
        </p>
      ))}
      {section.list && (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary">
          {section.list.map((item) => (
            <li key={item.slice(0, 40)}>{item}</li>
          ))}
        </ul>
      )}
      {section.subsections?.map((subsection) => (
        <div key={subsection.title ?? subsection.paragraphs?.[0]?.slice(0, 40)} className="space-y-2">
          {subsection.title && (
            <h3 className="text-sm font-medium text-primary">{subsection.title}</h3>
          )}
          {subsection.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
          {subsection.list && (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary">
              {subsection.list.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

export default function TerminosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex flex-col items-center gap-2">
              <LogoMark className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-base font-semibold text-primary">UcaNode</p>
                <p className="text-xs text-muted">Autogestión Ucasal</p>
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {TERMS_META.title}
            </h1>
            <p className="mt-2 text-xs text-muted">Última actualización: {TERMS_META.updatedAt}</p>
          </div>

          <Card className="rounded-2xl border-border bg-surface-card shadow-[var(--shadow-card-lg)]">
            <CardContent className="space-y-8 p-5 sm:p-8">
              {TERMS_SECTIONS.map((section) => (
                <TermsBlock key={section.title} section={section} />
              ))}

              <section className="border-t border-border pt-6">
                <p className="text-sm leading-relaxed text-secondary">
                  <span className="font-medium text-primary">Contacto de Soporte y Legal:</span>{" "}
                  Para consultas sobre el tratamiento de datos personales o el funcionamiento de la
                  Plataforma, el Usuario puede contactarse en{" "}
                  <Link
                    href={TERMS_META.contactUrl}
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    {TERMS_META.contactLabel}
                  </Link>
                  .
                </p>
              </section>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-secondary transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
