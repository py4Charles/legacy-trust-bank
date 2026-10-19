import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { IconArrow } from "./about/icons";

const facts = [
  { label: "Our heritage", value: "Established in 1923" },
  { label: "Our home", value: "Lapaz, Greater Accra" },
  { label: "Our promise", value: "Your Trust, Your Legacy." },
];

export function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <section className="relative flex min-h-[60vh] flex-1 items-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        />
        <Container className="relative py-20">
          <Badge tone="light">About Legacy Trust Bank</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            A legacy built on trust. A future, together.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Rooted in Ghana since 1923, we bring personal relationships and
            thoughtful innovation together — helping individuals, families and
            businesses build what comes next.
          </p>
          <div className="mt-8">
            <Link to="/about/our-story" className={buttonClass("white", "lg")}>
              Discover our story
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <div className="border-t border-ink-100 bg-white">
        <Container className="py-8">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-white px-6 py-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </div>
  );
}
