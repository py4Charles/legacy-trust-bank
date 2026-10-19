import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { downloadDocument, type DocumentId } from "./documents";
import { IconDoc, IconDownload, IconExpand } from "./icons";
import { PhotoSlot } from "./PhotoSlot";
import { PdfReader } from "./PdfReaders";

const pressReleases = [
  {
    id: "press-1" as const,
    anchor: "press-flood-relief",
    tone: "COMMUNITY SUPPORT",
    dateTime: "2026-10-09",
    dateLabel: "09 October 2026",
    title: "Legacy Trust Bank supports flood victims",
    body: "Relief and recovery support for affected customers and communities in Accra and parts of the Central Region.",
    file: "press release 1.pdf",
    size: "3 pages · 181 KB",
  },
  {
    id: "press-2" as const,
    anchor: "press-high-yield",
    tone: "PRODUCT ANNOUNCEMENT",
    dateTime: "2026-09-10",
    dateLabel: "10 September 2026",
    title: "Introducing the High-Yield Savings Account",
    body: "An announcement of the account’s savings features, access options and mobile account-opening process.",
    file: "press release 2.pdf",
    size: "3 pages · 192 KB",
  },
];

export function PressRoom({
  onOpenDoc,
}: {
  onOpenDoc: (id: DocumentId) => void;
}) {
  return (
    <section id="press-room" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Badge tone="brand">04 · Press room</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
              News, in our own words.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-600">
            Read our official announcements in their original format. Each
            release has its own PDF viewer, full-screen reading and download.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
          {pressReleases.map((release) => (
            <Card
              key={release.anchor}
              id={release.anchor}
              className="scroll-mt-24 overflow-hidden"
            >
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge tone="brand">{release.tone}</Badge>
                  <time
                    dateTime={release.dateTime}
                    className="text-xs text-ink-500"
                  >
                    {release.dateLabel}
                  </time>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-ink-900">
                  {release.title}
                </h3>
                <p className="mt-2 text-sm text-ink-600">{release.body}</p>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 text-xs text-ink-600">
                  <IconDoc className="h-4 w-4 shrink-0 text-brand-600" />
                  <span>{release.file}</span>
                  <span className="text-ink-400">· {release.size}</span>
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500 ring-1 ring-ink-200">
                    Original PDF
                  </span>
                </div>
              </CardBody>

              <PdfReader
                docId={release.id}
                variant="inline"
                lazy
                showPreviewLabel
                prevLabel={`Previous page of ${release.title}`}
                nextLabel={`Next page of ${release.title}`}
              />

              <div className="flex items-center justify-between gap-4 border-t border-ink-100 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  className={buttonClass("outline", "sm")}
                  onClick={() => onOpenDoc(release.id)}
                >
                  <IconExpand className="h-4 w-4" />
                  Read full screen
                </button>
                <button
                  type="button"
                  className={buttonClass("ghost", "sm")}
                  onClick={() => void downloadDocument(release.id)}
                >
                  <IconDownload className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardBody className="flex flex-wrap items-center gap-5">
            <PhotoSlot
              ariaLabel="Portrait placeholder: Media Contact"
              icon="person"
              compact
              className="h-20 w-20 shrink-0"
            />
            <div className="min-w-40">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                Media contact
              </span>
              <strong className="mt-1 block text-base font-semibold text-ink-900">
                Name to be added
              </strong>
              <span className="text-sm text-ink-500">Media relations</span>
            </div>
            <p className="max-w-xs text-sm text-ink-600">
              For press enquiries and interview requests.
            </p>
            <a
              href="mailto:joyceacquah@gmail.com"
              className={buttonClass("outline", "sm", "sm:ml-auto")}
            >
              Contact the media team
              <IconDownload className="h-4 w-4 rotate-180" />
            </a>
          </CardBody>
        </Card>

        <p className="mt-6 max-w-3xl text-sm text-ink-500">
          PDFs are rendered directly from the original uploaded files, not
          recreated as text or screenshots. All source pages are retained,
          including blank pages.
        </p>
      </Container>
    </section>
  );
}
