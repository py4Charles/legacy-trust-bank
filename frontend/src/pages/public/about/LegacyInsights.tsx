import { downloadDocument, type DocumentId } from "./documents";
import { IconArrow, IconDiagonal, IconDownload } from "./icons";
import { PhotoSlot } from "./PhotoSlot";

export function LegacyInsights({
  onOpenDoc,
}: {
  onOpenDoc: (id: DocumentId) => void;
}) {
  return (
    <section
      id="legacy-insights"
      className="insights-section section"
      aria-labelledby="insights-title"
    >
      <div className="about-container">
        <div className="section-heading heading-inline">
          <div>
            <p className="eyebrow">
              <span className="section-number">03</span>LEGACY INSIGHTS
            </p>
            <h2 id="insights-title">
              Our story,
              <br />
              <em>in motion.</em>
            </h2>
          </div>
          <p className="section-intro">
            Innovation, partnerships and performance.
            <br />
            Three newsletters. Three perspectives on our progress.
          </p>
        </div>

        <nav className="insight-jumps" aria-label="Newsletter sections">
          <a href="#secure-touch">
            01 <span>The Secure Touch</span>
            <IconDiagonal className="icon" />
          </a>
          <a href="#tradition-innovation">
            02 <span>Tradition &amp; innovation</span>
            <IconDiagonal className="icon" />
          </a>
          <a href="#quarterly-results">
            03 <span>Quarterly results</span>
            <IconDiagonal className="icon" />
          </a>
        </nav>

        <article
          id="secure-touch"
          className="newsletter-feature"
          aria-labelledby="secure-title"
          data-source="newsletter-1"
        >
          <PhotoSlot
            photo="biometric-banking"
            variant="editorial-photo biometric-photo"
            ariaLabel="Photo placeholder: customer using biometric mobile banking"
            label="MOBILE BANKING PHOTOGRAPH"
            sub="Biometric login / customer experience"
            note="IMAGE TO BE ADDED"
            index="01"
            crop
          />
          <div className="feature-copy">
            <div className="article-meta">
              <span className="tag">NEWSLETTER 01</span>
              <time dateTime="2026-10-03">03 October 2026</time>
            </div>
            <h3 id="secure-title">The Secure Touch</h3>
            <p className="feature-deck">
              A simpler way in.
              <br />
              The same commitment to trust.
            </p>
            <p>
              The Secure Touch introduces biometric login for the Legacy Trust
              Mobile app, announcing a launch date of 15 October 2026. The
              focus: making everyday access more natural without losing sight of
              privacy.
            </p>
            <ul className="feature-list">
              <li>Fingerprint access for a simpler sign-in</li>
              <li>Device-based biometric verification</li>
              <li>Password and PIN options retained</li>
            </ul>
            <div className="article-actions">
              <button
                className="text-button"
                type="button"
                data-open-doc="newsletter-1"
                onClick={() => onOpenDoc("newsletter-1")}
              >
                Read the full newsletter
                <IconArrow className="icon" />
              </button>
              <button
                type="button"
                className="subtle-download"
                data-download-doc="newsletter-1"
                aria-label="Download newsletter 1 PDF"
                onClick={() => void downloadDocument("newsletter-1")}
              >
                <IconDownload className="icon" />
                PDF
              </button>
            </div>
            <span className="source-filename">SOURCE: newsletter 1.pdf</span>
          </div>
        </article>

        <article
          id="tradition-innovation"
          className="newsletter-feature reverse"
          aria-labelledby="innovation-title"
          data-source="newsletter-2"
        >
          <div className="feature-copy">
            <div className="article-meta">
              <span className="tag">NEWSLETTER 02</span>
              <time dateTime="2024-08-05">05 August 2024</time>
            </div>
            <h3 id="innovation-title">
              Bridging tradition
              <br />
              and innovation
            </h3>
            <p className="feature-deck">
              Listening more closely.
              <br />
              Moving forward, together.
            </p>
            <p>
              Customer feedback set the direction. This newsletter explores how
              partnerships with Ghanaian fintech innovators were designed to
              reduce friction in transfers, credit decisions and everyday
              digital banking.
            </p>
            <ul className="feature-list">
              <li>Partnerships shaped around real customer needs</li>
              <li>A focus on faster, simpler banking experiences</li>
              <li>Security and data privacy at the centre</li>
            </ul>
            <div className="article-actions">
              <button
                className="text-button"
                type="button"
                data-open-doc="newsletter-2"
                onClick={() => onOpenDoc("newsletter-2")}
              >
                Read the full newsletter
                <IconArrow className="icon" />
              </button>
              <button
                type="button"
                className="subtle-download"
                data-download-doc="newsletter-2"
                aria-label="Download newsletter 2 PDF"
                onClick={() => void downloadDocument("newsletter-2")}
              >
                <IconDownload className="icon" />
                PDF
              </button>
            </div>
            <span className="source-filename">SOURCE: newsletter 2.pdf</span>
          </div>
          <PhotoSlot
            photo="fintech-partnership"
            variant="editorial-photo partnership-photo"
            ariaLabel="Photo placeholder: Legacy Trust Bank and fintech partners collaborating"
            label="PARTNERSHIP PHOTOGRAPH"
            sub="Team collaboration / fintech innovation"
            note="IMAGE TO BE ADDED"
            index="02"
            crop
          />
        </article>

        <article
          id="quarterly-results"
          className="results-feature"
          aria-labelledby="results-title"
          data-source="newsletter-3"
        >
          <div className="results-heading">
            <div>
              <div className="article-meta">
                <span className="tag tag-light">NEWSLETTER 03</span>
                <span>Reporting period: Q3 2026</span>
              </div>
              <h3 id="results-title">Progress, in perspective.</h3>
              <p>
                Quarterly financial results for the period ended 30 September
                2026, as reported in the supplied newsletter.
              </p>
            </div>
            <button
              className="button button-outline-light"
              type="button"
              data-open-doc="newsletter-3"
              onClick={() => onOpenDoc("newsletter-3")}
            >
              Read the results
              <IconArrow className="icon" />
            </button>
          </div>
          <dl className="metrics-grid">
            <div>
              <dt>Revenue</dt>
              <dd>
                <span>GH₵</span>186.4
                <small>million</small>
              </dd>
            </div>
            <div>
              <dt>Profit before tax</dt>
              <dd>
                <span>GH₵</span>42.6
                <small>million</small>
              </dd>
            </div>
            <div>
              <dt>Profit after tax</dt>
              <dd>
                <span>GH₵</span>29.8
                <small>million</small>
              </dd>
            </div>
            <div>
              <dt>Total assets</dt>
              <dd>
                <span>GH₵</span>4.85
                <small>billion</small>
              </dd>
            </div>
            <div>
              <dt>Customer deposits</dt>
              <dd>
                <span>GH₵</span>3.72
                <small>billion</small>
              </dd>
            </div>
            <div>
              <dt>Loans &amp; advances</dt>
              <dd>
                <span>GH₵</span>2.41
                <small>billion</small>
              </dd>
            </div>
          </dl>
          <div className="results-footer">
            <span>SOURCE: NEWSLWEETER 3.pdf</span>
            <button
              className="subtle-download light"
              type="button"
              data-download-doc="newsletter-3"
              onClick={() => void downloadDocument("newsletter-3")}
            >
              <IconDownload className="icon" />
              Download original PDF
            </button>
          </div>
        </article>

        <aside
          className="editorial-note"
          aria-label="Publication date needs confirmation"
        >
          <strong>Publication date to confirm.</strong> Newsletter 3’s header
          says “10 August 2025”, but its body reports Q3 2026 results. This
          draft uses the reporting period and preserves the original PDF
          unchanged.
        </aside>
      </div>
    </section>
  );
}
