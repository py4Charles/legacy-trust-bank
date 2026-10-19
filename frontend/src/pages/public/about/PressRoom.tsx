import { downloadDocument, type DocumentId } from "./documents";
import { IconArrow, IconDoc, IconDownload, IconExpand } from "./icons";
import { PhotoSlot } from "./PhotoSlot";
import { PdfReader } from "./PdfReaders";

export function PressRoom({
  onOpenDoc,
}: {
  onOpenDoc: (id: DocumentId) => void;
}) {
  return (
    <section
      id="press-room"
      className="press-section section"
      aria-labelledby="press-title"
    >
      <div className="about-container">
        <div className="section-heading heading-inline">
          <div>
            <p className="eyebrow">
              <span className="section-number">04</span>PRESS ROOM
            </p>
            <h2 id="press-title">
              News, in
              <br />
              <em>our own words.</em>
            </h2>
          </div>
          <p className="section-intro">
            Read our official announcements in their original format. Each
            release has its own PDF viewer, full-screen reading and download.
          </p>
        </div>

        <div className="press-grid">
          <article
            id="press-flood-relief"
            className="press-card"
            aria-labelledby="flood-title"
            data-source="press-1"
          >
            <div className="press-card-header">
              <div className="article-meta">
                <span className="mini-label">COMMUNITY SUPPORT</span>
                <time dateTime="2026-10-09">09 October 2026</time>
              </div>
              <h3 id="flood-title">Legacy Trust Bank supports flood victims</h3>
              <p>
                Relief and recovery support for affected customers and
                communities in Accra and parts of the Central Region.
              </p>
              <div className="document-file">
                <IconDoc className="icon" />
                <span>
                  press release 1.pdf{" "}
                  <span className="file-size">· 3 pages · 181 KB</span>
                </span>
                <span className="original-tag">ORIGINAL PDF</span>
              </div>
            </div>
            <PdfReader
              docId="press-1"
              variant="inline"
              lazy
              showPreviewLabel
              prevLabel="Previous page of flood relief press release"
              nextLabel="Next page of flood relief press release"
            />
            <div className="press-card-actions">
              <button
                type="button"
                className="text-button"
                data-open-doc="press-1"
                onClick={() => onOpenDoc("press-1")}
              >
                <IconExpand className="icon" />
                Read full screen
              </button>
              <button
                type="button"
                className="text-button"
                data-download-doc="press-1"
                onClick={() => void downloadDocument("press-1")}
              >
                <IconDownload className="icon" />
                Download PDF
              </button>
            </div>
          </article>

          <article
            id="press-high-yield"
            className="press-card"
            aria-labelledby="savings-title"
            data-source="press-2"
          >
            <div className="press-card-header">
              <div className="article-meta">
                <span className="mini-label">PRODUCT ANNOUNCEMENT</span>
                <time dateTime="2026-09-10">10 September 2026</time>
              </div>
              <h3 id="savings-title">
                Introducing the High-Yield Savings Account
              </h3>
              <p>
                An announcement of the account’s savings features, access
                options and mobile account-opening process.
              </p>
              <div className="document-file">
                <IconDoc className="icon" />
                <span>
                  press release 2.pdf{" "}
                  <span className="file-size">· 3 pages · 192 KB</span>
                </span>
                <span className="original-tag">ORIGINAL PDF</span>
              </div>
            </div>
            <PdfReader
              docId="press-2"
              variant="inline"
              lazy
              showPreviewLabel
              prevLabel="Previous page of savings account press release"
              nextLabel="Next page of savings account press release"
            />
            <div className="press-card-actions">
              <button
                type="button"
                className="text-button"
                data-open-doc="press-2"
                onClick={() => onOpenDoc("press-2")}
              >
                <IconExpand className="icon" />
                Read full screen
              </button>
              <button
                type="button"
                className="text-button"
                data-download-doc="press-2"
                onClick={() => void downloadDocument("press-2")}
              >
                <IconDownload className="icon" />
                Download PDF
              </button>
            </div>
          </article>
        </div>

        <div className="media-contact">
          <PhotoSlot
            photo="media-contact"
            variant="media-photo"
            ariaLabel="Portrait placeholder: Media Contact"
            icon="person"
            compact
          />
          <div className="media-person">
            <span className="mini-label">MEDIA CONTACT</span>
            <strong data-edit="name">Name to be added</strong>
            <span className="media-role" data-edit="role">
              Media relations
            </span>
          </div>
          <p>For press enquiries and interview requests.</p>
          <a
            className="text-button"
            href="mailto:joyceacquah@gmail.com"
          >
            Contact the media team
            <IconArrow className="icon" />
          </a>
        </div>

        <p className="press-footnote">
          PDFs are rendered directly from the original uploaded files, not
          recreated as text or screenshots. All source pages are retained,
          including blank pages.
        </p>
      </div>
    </section>
  );
}
