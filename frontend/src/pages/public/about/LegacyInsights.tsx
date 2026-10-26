import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { downloadDocument, type DocumentId } from "./documents";
import { IconArrow, IconDiagonal, IconDoc, IconDownload } from "./icons";
import { PdfThumbnail } from "./PdfThumbnail";

const jumps = [
  { href: "#secure-touch", index: "01", label: "The Secure Touch" },
  { href: "#tradition-innovation", index: "02", label: "Tradition & innovation" },
  { href: "#quarterly-results", index: "03", label: "Quarterly results" },
];

const metrics = [
  { label: "Revenue", value: "186.4", unit: "million" },
  { label: "Profit before tax", value: "42.6", unit: "million" },
  { label: "Profit after tax", value: "29.8", unit: "million" },
  { label: "Total assets", value: "4.85", unit: "billion" },
  { label: "Customer deposits", value: "3.72", unit: "billion" },
  { label: "Loans & advances", value: "2.41", unit: "billion" },
];

export function LegacyInsights({
  onOpenDoc,
}: {
  onOpenDoc: (id: DocumentId) => void;
}) {
  return (
    <section id="legacy-insights" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Badge tone="brand">03 · Legacy Insights</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
              Our story, in motion.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-600">
            Innovation, partnerships and performance. Three newsletters. Three
            perspectives on our progress.
          </p>
        </div>

        <nav
          className="mt-8 grid gap-3 sm:grid-cols-3"
          aria-label="Newsletter sections"
        >
          {jumps.map((jump) => (
            <a
              key={jump.href}
              href={jump.href}
              className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="text-xs font-semibold text-brand-600">
                {jump.index}
              </span>
              <span>{jump.label}</span>
              <IconDiagonal className="ml-auto h-4 w-4 text-ink-400" />
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-10">
          <article id="secure-touch" className="scroll-mt-24">
            <Card className="overflow-hidden">
              <div className="grid items-stretch overflow-hidden lg:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onOpenDoc("newsletter-1")}
                  className="group relative min-h-64 overflow-hidden bg-ink-100 text-left"
                  aria-label="Preview the original newsletter 1 PDF"
                >
                  <PdfThumbnail
                    docId="newsletter-1"
                    className="h-full min-h-64 w-full"
                  />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors group-hover:bg-brand-700/90">
                    <IconDoc className="h-4 w-4" />
                    PDF preview
                  </span>
                </button>
                <CardBody className="flex flex-col justify-center border-t border-dashed border-ink-200 lg:border-l lg:border-t-0">
                  <div className="flex items-center justify-between gap-4">
                    <Badge tone="brand">Newsletter 01</Badge>
                    <time
                      dateTime="2026-10-03"
                      className="text-xs text-ink-500"
                    >
                      03 October 2026
                    </time>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-ink-900">
                    The Secure Touch
                  </h3>
                  <p className="mt-2 font-display text-lg text-ink-700">
                    A simpler way in. The same commitment to trust.
                  </p>
                  <p className="mt-4 text-sm text-ink-600">
                    The Secure Touch introduces biometric login for the Legacy
                    Trust Mobile app, announcing a launch date of 15 October
                    2026. The focus: making everyday access more natural without
                    losing sight of privacy.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
                    {[
                      "Fingerprint access for a simpler sign-in",
                      "Device-based biometric verification",
                      "Password and PIN options retained",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-positive-600 ring-1 ring-emerald-100">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                            aria-hidden="true"
                          >
                            <path d="m5 12 5 5 9-10" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className={buttonClass("primary", "sm")}
                      onClick={() => onOpenDoc("newsletter-1")}
                    >
                      Read the full newsletter
                      <IconArrow className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={buttonClass("ghost", "sm")}
                      aria-label="Download newsletter 1 PDF"
                      onClick={() => void downloadDocument("newsletter-1")}
                    >
                      <IconDownload className="h-4 w-4" />
                      PDF
                    </button>
                  </div>
                  <span className="mt-3 text-[10px] uppercase tracking-wide text-ink-400">
                    Source: newsletter 1.pdf
                  </span>
                </CardBody>
              </div>
            </Card>
          </article>

          <article id="tradition-innovation" className="scroll-mt-24">
            <Card className="overflow-hidden">
              <div className="grid items-stretch overflow-hidden lg:grid-cols-2">
                <CardBody className="order-2 flex flex-col justify-center border-t border-dashed border-ink-200 lg:order-1 lg:border-r lg:border-t-0">
                  <div className="flex items-center justify-between gap-4">
                    <Badge tone="brand">Newsletter 02</Badge>
                    <time
                      dateTime="2024-08-05"
                      className="text-xs text-ink-500"
                    >
                      05 August 2024
                    </time>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-ink-900">
                    Bridging tradition and innovation
                  </h3>
                  <p className="mt-2 font-display text-lg text-ink-700">
                    Listening more closely. Moving forward, together.
                  </p>
                  <p className="mt-4 text-sm text-ink-600">
                    Customer feedback set the direction. This newsletter explores
                    how partnerships with Ghanaian fintech innovators were
                    designed to reduce friction in transfers, credit decisions
                    and everyday digital banking.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
                    {[
                      "Partnerships shaped around real customer needs",
                      "A focus on faster, simpler banking experiences",
                      "Security and data privacy at the centre",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-positive-600 ring-1 ring-emerald-100">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                            aria-hidden="true"
                          >
                            <path d="m5 12 5 5 9-10" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className={buttonClass("primary", "sm")}
                      onClick={() => onOpenDoc("newsletter-2")}
                    >
                      Read the full newsletter
                      <IconArrow className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={buttonClass("ghost", "sm")}
                      aria-label="Download newsletter 2 PDF"
                      onClick={() => void downloadDocument("newsletter-2")}
                    >
                      <IconDownload className="h-4 w-4" />
                      PDF
                    </button>
                  </div>
                  <span className="mt-3 text-[10px] uppercase tracking-wide text-ink-400">
                    Source: newsletter 2.pdf
                  </span>
                </CardBody>
                <button
                  type="button"
                  onClick={() => onOpenDoc("newsletter-2")}
                  className="group relative order-1 min-h-64 overflow-hidden bg-ink-100 text-left lg:order-2"
                  aria-label="Preview the original newsletter 2 PDF"
                >
                  <PdfThumbnail
                    docId="newsletter-2"
                    className="h-full min-h-64 w-full"
                  />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors group-hover:bg-brand-700/90">
                    <IconDoc className="h-4 w-4" />
                    PDF preview
                  </span>
                </button>
              </div>
            </Card>
          </article>

          <article
            id="quarterly-results"
            className="scroll-mt-24 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-6 text-white sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="light">Newsletter 03</Badge>
                  <span className="text-xs text-white/60">
                    Reporting period: Q3 2026
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold">
                  Progress, in perspective.
                </h3>
                <p className="mt-3 text-sm text-white/70">
                  Quarterly financial results for the period ended 30 September
                  2026, as reported in the supplied newsletter.
                </p>
              </div>
              <button
                type="button"
                className={buttonClass("outlineLight", "sm")}
                onClick={() => onOpenDoc("newsletter-3")}
              >
                Read the results
                <IconArrow className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/15 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-brand-900/80 p-5">
                  <dt className="text-xs text-white/60">{metric.label}</dt>
                  <dd className="mt-2 font-display text-3xl font-bold">
                    <span className="mr-1 text-sm font-semibold text-accent-400">
                      GH₵
                    </span>
                    {metric.value}
                    <small className="mt-1 block text-xs font-normal text-white/60">
                      {metric.unit}
                    </small>
                  </dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => onOpenDoc("newsletter-3")}
              className="group relative mt-6 block w-full overflow-hidden rounded-xl border border-white/15 bg-white text-left"
              aria-label="Preview the original newsletter 3 PDF"
            >
              <PdfThumbnail docId="newsletter-3" className="h-64 w-full" />
              <span className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-ink-950/50 via-transparent to-transparent p-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm transition-colors group-hover:bg-brand-50">
                  <IconDoc className="h-4 w-4" />
                  Page 1 preview
                </span>
              </span>
            </button>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
              <span className="text-[10px] uppercase tracking-wide text-white/50">
                Source: newsletter 3.pdf
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                onClick={() => void downloadDocument("newsletter-3")}
              >
                <IconDownload className="h-4 w-4" />
                Download original PDF
              </button>
            </div>
          </article>
        </div>

        {/* <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Publication date to confirm.</strong> Newsletter 3’s header
          says “10 August 2025”, but its body reports Q3 2026 results. This draft
          uses the reporting period and preserves the original PDF unchanged.
        </aside> */}
      </Container>
    </section>
  );
}
