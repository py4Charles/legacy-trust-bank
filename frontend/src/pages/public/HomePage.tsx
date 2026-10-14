import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/buttonStyles";
import { Badge } from "@/components/ui/Badge";
import { productCategories, products } from "@/data/mock";
import woman from "@/assets/woman.png";
import everydayCheque from "@/assets/everyday-cheque.png";
import flexiSavings from "@/assets/flexi-savings.png";
import "@/styles/woman.css";

const stats = [
  { label: "Clients served", value: "2.4M+" },
  { label: "Countries", value: "12" },
  { label: "Uptime (12 mo.)", value: "99.99%" },
  { label: "Fraud recovered", value: "GH₵480M" },
];

const trustSignals = [
  {
    title: "Bank-grade security",
    body: "256-bit encryption, biometric login and real-time fraud monitoring on every transaction.",
  },
  {
    title: "Regulated & audited",
    body: "Fully licensed by the FSCA and audited annually to international banking standards.",
  },
  {
    title: "Deposits protected",
    body: "Your deposits are covered by the deposit insurance scheme up to the statutory limit.",
  },
];

const quickAccess = [
  { label: "ATM & Branch Locator", href: "/support" },
  { label: "Rates & Fees", href: "/support" },
  { label: "Report Fraud", href: "/security" },
  { label: "Contact Us", href: "/support" },
];

const productImages: Record<string, string> = {
  "everyday-cheque": everydayCheque,
  "flex-savings": flexiSavings,
};

const categoryIcons: Record<string, ReactNode> = {
  accounts: (
    <>
      <path d="M20 12V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2" />
      <path d="M21 10h-6a2 2 0 0 0 0 4h6v-4Z" />
    </>
  ),
  savings: (
    <>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M17 7h4v4" />
    </>
  ),
  loans: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </>
  ),
  cards: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
};

export function HomePage() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
        <Container className="relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Badge tone="light">
              Now with instant account opening
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Banking built on trust, designed for real life.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Manage your money, grow your savings and move it safely. <br />
              All from one secure app backed by decades of <br />
              banking expertise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className={buttonClass("white", "lg")}>
                Open an Account
              </Link>
              <Link
                to="/products/accounts"
                className={buttonClass("outlineLight", "lg")}
              >
                Explore Accounts
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-white/60">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[2.5rem] bg-white/10 blur-2xl"
            />
            <img
              src={woman}
              alt="A Legacy Trust Bank client banking with confidence"
              className="woman-image relative w-full max-w-2xl left-40 top-20 scale-150 object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">
              Find the right product
            </h2>
            <p className="mt-3 text-ink-600">
              Whether you're banking day to day or planning for the long term,
              there's a product built for it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category) => (
              <Link key={category.id} to={`/products/${category.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardBody className="flex h-full flex-col">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        {categoryIcons[category.id]}
                      </svg>
                    </span>
                    <h3 className="mt-4 text-base font-semibold">
                      {category.label}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-ink-600">
                      {category.description}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-brand-700">
                      View products →
                    </span>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Popular right now
              </h2>
              <p className="mt-3 text-ink-600">
                Chosen by thousands of clients every month.
              </p>
            </div>
            <Link
              to="/products/accounts"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              See all products →
            </Link>
          </div>

          <div className="mt-10 space-y-6">
            {featured.map((product, index) => {
              const textOnRight = index % 2 === 1;
              return (
                <Card key={product.slug} className="relative overflow-hidden">
                  <div
                    className={cn(
                      "flex items-stretch",
                      textOnRight && "flex-row-reverse",
                    )}
                  >
                    <CardBody className="flex min-h-56 flex-1 flex-col justify-center">
                      <Badge tone="brand" className="self-start">
                        {product.category}
                      </Badge>
                      <h3 className="mt-3 text-2xl font-semibold">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-ink-600">
                        {product.tagline}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-ink-900">
                        {product.monthlyFee}
                      </p>
                      <Link
                        to={`/products/${product.category}/${product.slug}`}
                        className={buttonClass("outline", "sm", "mt-5 self-start")}
                      >
                        Learn more
                      </Link>
                    </CardBody>

                    <div
                      className={cn(
                        "flex w-1/2 shrink-0 items-center justify-center bg-ink-100 text-ink-400",
                        textOnRight
                          ? "[clip-path:polygon(0_0,82%_0,100%_100%,0_100%)]"
                          : "[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]",
                      )}
                    >
                      {productImages[product.slug] ? (
                        <img
                          src={productImages[product.slug]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8"
                            aria-hidden="true"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                          <span className="text-xs font-medium">
                            Sample image
                          </span>
                        </div>
                      )}
                    </div>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 z-10 h-full w-full text-white"
                    >
                      <line
                        x1={textOnRight ? 41 : 59}
                        y1="0"
                        x2="50"
                        y2="100"
                        stroke="currentColor"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight">
            Your security is the priority
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {trustSignals.map((signal) => (
              <Card key={signal.title}>
                <CardBody>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-positive-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-base font-semibold">
                    {signal.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600">{signal.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-4 rounded-2xl border border-ink-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickAccess.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-ink-900 px-8 py-14 text-center text-white">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
              Ready to bank with confidence?
            </h2>
            <p className="max-w-xl text-white/70">
              Open an account in minutes. No paperwork, no branch visit, no
              compromise on security.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className={buttonClass("onbrand", "lg")}
              >
                Open an Account
              </Link>
              <Link
                to="/products/savings"
                className={buttonClass("outlineLight", "lg")}
              >
                Compare Savings
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
