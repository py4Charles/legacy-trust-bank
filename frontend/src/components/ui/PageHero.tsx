import type { ReactNode } from "react";
import { Container } from "./Container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-white to-ink-50/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl"
      />
      <Container className="relative py-14 sm:py-16">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 ring-1 ring-brand-100">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-ink-900 sm:text-[2.6rem] sm:leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            {description}
          </p>
        )}
        {actions && (
          <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
        )}
      </Container>
    </section>
  );
}