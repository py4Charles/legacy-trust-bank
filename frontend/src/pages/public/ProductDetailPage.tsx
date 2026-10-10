import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";
import { products } from "@/data/mock";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-ink-600">
          The product you're looking for isn't available.
        </p>
        <Link
          to="/products/accounts"
          className={buttonClass("primary", "md", "mt-6")}
        >
          Browse products
        </Link>
      </Container>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        description={product.tagline}
        actions={
          <>
            <Link to="/register" className={buttonClass("primary", "lg")}>
              Apply Now
            </Link>
            <Link to="/support" className={buttonClass("outline", "lg")}>
              Speak to an advisor
            </Link>
          </>
        }
      />

      <Container className="grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-ink-600">{product.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Key benefits</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-700 shadow-soft"
                >
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
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Eligibility requirements</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {product.eligibility.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              What you'll need to apply
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {product.documents.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-brand-700 to-brand-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Monthly fee
              </p>
              <p className="mt-3 text-3xl font-bold">{product.monthlyFee}</p>
            </div>
            <CardBody>
              <p className="text-sm text-ink-500">
                Fees and rates issued in the latest product schedule.
              </p>
              <Link
                to="/support"
                className={buttonClass("outline", "sm", "mt-4 w-full")}
              >
                View full fee schedule
              </Link>
              <Link
                to="/register"
                className={buttonClass("primary", "sm", "mt-2 w-full")}
              >
                Apply now
              </Link>
            </CardBody>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="text-sm font-semibold text-ink-900">
                  Similar products
                </h3>
                <ul className="mt-3 space-y-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/products/${item.category}/${item.slug}`}
                        className="block rounded-lg border border-ink-100 p-3 text-sm transition-colors hover:border-brand-300 hover:bg-brand-50"
                      >
                        <span className="font-medium text-ink-900">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-xs text-ink-500">
                          {item.monthlyFee}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </aside>
      </Container>
    </>
  );
}
