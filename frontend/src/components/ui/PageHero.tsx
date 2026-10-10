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
    <section className="border-b border-ink-200 bg-white">
      <Container className="py-12 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-ink-600">{description}</p>
        )}
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </Container>
    </section>
  );
}
