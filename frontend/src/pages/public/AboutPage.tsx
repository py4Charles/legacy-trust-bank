import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";
import type { DocumentId } from "./about/documents";
import {
  IconArrow,
  IconConnect,
  IconDiagonal,
  IconHeart,
  IconMail,
  IconPhone,
  IconShield,
} from "./about/icons";
import { LegacyInsights } from "./about/LegacyInsights";
import { PhotoSlot } from "./about/PhotoSlot";
import { ExpandedPdfReader } from "./about/PdfReaders";
import { PressRoom } from "./about/PressRoom";

const facts = [
  { label: "Our heritage", value: "Established in 1923" },
  { label: "Our home", value: "Lapaz, Greater Accra" },
  { label: "Our promise", value: "Your Trust, Your Legacy." },
];

const values = [
  {
    icon: IconShield,
    label: "01 / Trust",
    title: "Relationships first.",
    body: "Personal service and the confidence that comes from being heard.",
  },
  {
    icon: IconConnect,
    label: "02 / Innovation",
    title: "Progress with purpose.",
    body: "Thoughtful partnerships and simpler tools, shaped by customer feedback.",
  },
  {
    icon: IconHeart,
    label: "03 / Community",
    title: "Growing together.",
    body: "Standing alongside families and businesses when support matters most.",
  },
];

const people = [
  { role: "Founder", aria: "Portrait placeholder: Founder" },
  { role: "Co-founder", aria: "Portrait placeholder: First co-founder" },
  { role: "Co-founder", aria: "Portrait placeholder: Second co-founder" },
  { role: "Managing Director", aria: "Portrait placeholder: Managing Director" },
];

export function AboutPage() {
  const toastTimerRef = useRef<number>();
  const [openDocId, setOpenDocId] = useState<DocumentId | null>(null);
  const [toast, setToast] = useState("");

  // Toast messages raised by download failures etc.
  useEffect(() => {
    const handler = (event: Event) => {
      setToast((event as CustomEvent<string>).detail);
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setToast(""), 4200);
    };
    window.addEventListener("about:toast", handler);
    return () => {
      window.removeEventListener("about:toast", handler);
      window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <div id="top" className="scroll-smooth">
      <PageHero
        eyebrow="About Legacy Trust Bank"
        title="A legacy built on trust. A future, together."
        description="Rooted in Ghana since 1923, we bring personal relationships and thoughtful innovation together — helping individuals, families and businesses build what comes next."
        actions={
          <a href="#our-story" className={buttonClass("primary", "lg")}>
            Discover our story
            <IconArrow className="h-4 w-4" />
          </a>
        }
      />

      <Container className="py-12">
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

      <section
        id="our-story"
        className="scroll-mt-24 border-t border-ink-100 bg-white py-16 sm:py-20"
        aria-labelledby="story-title"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge tone="brand">01 · Our story</Badge>
              <h2
                id="story-title"
                className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
              >
                Strong roots. New possibilities.
              </h2>
            </div>
            <div className="space-y-4 text-ink-600 lg:pt-2">
              <p>
                Legacy Trust Bank was established in 1923 by Mr. Collins Asare,
                together with co-founders Mr. Kenneth Antwi and Dr. Kojo Asare.
                Our headquarters is in Lapaz, in Ghana’s Greater Accra Region.
              </p>
              <p>
                From account opening and transfers to loans and investments, our
                services support the everyday needs and long-term plans of the
                people we serve.
              </p>
              <p>
                Our story continues through closer customer relationships,
                digital innovation and support for the communities around us.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.label}>
                  <CardBody className="flex h-full flex-col">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                      {value.label}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-ink-900">
                      {value.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-ink-600">
                      {value.body}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section
        id="our-people"
        className="scroll-mt-24 py-16 sm:py-20"
        aria-labelledby="people-title"
      >
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <Badge tone="brand">02 · Founders &amp; leadership</Badge>
              <h2
                id="people-title"
                className="mt-4 text-3xl font-bold tracking-tight text-ink-900"
              >
                People behind the promise.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-600">
              A dedicated place for the people who shaped our beginnings and
              guide our next chapter.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((person, index) => (
              <Card key={index}>
                <CardBody>
                  <PhotoSlot
                    ariaLabel={person.aria}
                    note="Portrait to be added"
                    icon="person"
                    compact
                    className="h-56 w-full"
                  />
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    {person.role}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink-900">
                    Name to be added
                  </h3>
                  <p className="mt-1 text-sm text-ink-600">
                    Short biography to be added.
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
            Profile placeholders — portraits, names and biographies can be
            filled in later.
          </p>
        </Container>
      </section>

      <LegacyInsights onOpenDoc={setOpenDocId} />
      <PressRoom onOpenDoc={setOpenDocId} />

      <section
        id="contact"
        className="scroll-mt-24 pb-16 sm:pb-20"
        aria-labelledby="contact-title"
      >
        <Container>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 px-8 py-14 text-white sm:px-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge tone="light">Let’s build what’s next</Badge>
                <h2
                  id="contact-title"
                  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Your next chapter starts with a conversation.
                </h2>
              </div>
              <div className="space-y-3">
                <a
                  href="tel:0302211211"
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <IconPhone className="h-5 w-5 text-accent-400" />
                  <span>
                    <small className="block text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Call our team
                    </small>
                    <span className="font-semibold">0302-211-211</span>
                  </span>
                  <IconDiagonal className="ml-auto h-4 w-4 text-white/60" />
                </a>
                <a
                  href="mailto:LTBANK@gmail.com"
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <IconMail className="h-5 w-5 text-accent-400" />
                  <span>
                    <small className="block text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Email us
                    </small>
                    <span className="font-semibold">LTBANK@gmail.com</span>
                  </span>
                  <IconDiagonal className="ml-auto h-4 w-4 text-white/60" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="flex flex-wrap items-center gap-4 border-t border-ink-100 py-5 text-xs text-ink-500">
          <span>Legacy Trust Bank · Your Trust, Your Legacy.</span>
          <span className="hidden sm:inline">
            About page design preview · Images and profiles are placeholders
          </span>
          <a
            href="#top"
            className="ml-auto inline-flex items-center gap-2 font-semibold text-ink-700 transition-colors hover:text-brand-700"
          >
            Back to top
            <IconDiagonal className="h-4 w-4" />
          </a>
        </div>
      </Container>

      {openDocId && (
        <ExpandedPdfReader
          key={openDocId}
          docId={openDocId}
          onClose={() => setOpenDocId(null)}
        />
      )}

      <div
        id="about-toast"
        className={
          "fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-ink-900 px-5 py-3 text-center text-sm text-white shadow-lg transition-all " +
          (toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-5 opacity-0")
        }
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}
