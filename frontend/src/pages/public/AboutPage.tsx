import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { IconArrow } from "./about/icons";
import { PhotoSlot } from "./about/PhotoSlot";

const facts = [
  { label: "Our heritage", value: "Established in 1923" },
  { label: "Our home", value: "Lapaz, Greater Accra" },
  { label: "Our promise", value: "Your Trust, Your Legacy." },
];

export function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <section className="flex min-h-[65vh] flex-1 items-center">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge tone="brand">About Legacy Trust Bank</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              A legacy built on trust. A future, together.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
              Rooted in Ghana since 1923, we bring personal relationships and
              thoughtful innovation together — helping individuals, families and
              businesses build what comes next.
            </p>
            <div className="mt-8">
              <Link to="/about/our-story" className={buttonClass("primary", "lg")}>
                Discover our story
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <PhotoSlot
              ariaLabel="Portrait placeholder: man folding his arms"
              label="Full portrait photograph"
              sub="Man folding his arms"
              note="Image to be added"
              icon="person"
              className="h-80 w-full sm:h-96 lg:h-[34rem]"
            />
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
