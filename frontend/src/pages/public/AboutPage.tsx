import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Legacy Trust Bank"
        description="We are a purpose-led bank committed to secure, transparent, and accessible financial services for individuals and businesses."
        actions={
          <Link to="/register" className={buttonClass("primary", "lg")}>
            Open an Account
          </Link>
        }
      />

      <Container className="grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-6">
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-semibold text-ink-900">Our Mission</h2>
              <p className="text-sm leading-relaxed text-ink-600">
                To empower our customers to achieve their financial goals by
                providing reliable banking products, personalised service, and
                industry-leading digital security.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-semibold text-ink-900">Our Values</h2>
              <ul className="space-y-3 text-sm text-ink-700">
                <li className="flex items-start gap-2.5">
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
                  Trust and integrity in everything we do
                </li>
                <li className="flex items-start gap-2.5">
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
                  Security-first approach to protect your data
                </li>
                <li className="flex items-start gap-2.5">
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
                  Customer-centric solutions that fit your needs
                </li>
                <li className="flex items-start gap-2.5">
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
                  Innovation that makes banking simpler
                </li>
              </ul>
            </CardBody>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-base font-semibold text-ink-900">Company Details</h2>
              <div className="space-y-2 text-sm text-ink-600">
                <div>
                  <p className="font-semibold text-ink-700">Legacy Trust Bank Ltd</p>
                  <p>Registered Financial Services Provider (FSP 12345)</p>
                </div>
                <div>
                  <p className="font-semibold text-ink-700">Regulated by</p>
                  <p>Financial Sector Conduct Authority (FSCA)</p>
                </div>
                <div>
                  <p className="font-semibold text-ink-700">Head Office</p>
                  <p>123 Banking Street, Sandton, 2196</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-base font-semibold text-ink-900">Get in Touch</h2>
              <p className="text-sm text-ink-600">
                Questions about our products or services? We are here to help.
              </p>
              <Link
                to="/support"
                className={buttonClass("outline", "md", "w-full justify-center")}
              >
                Contact Support
              </Link>
            </CardBody>
          </Card>
        </aside>
      </Container>
    </>
  );
}
