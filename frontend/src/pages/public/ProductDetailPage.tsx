import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
                  className="flex items-start gap-3 rounded-lg border border-ink-100 bg-white p-4 text-sm text-ink-700"
                >
                  <span className="text-positive-600" aria-hidden="true">
                    ✓
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
          <Card>
            <CardBody>
              <Badge tone="brand">Fees</Badge>
              <p className="mt-3 text-2xl font-bold">{product.monthlyFee}</p>
              <p className="mt-1 text-sm text-ink-500">
                Fees and rates issued in the latest product schedule.
              </p>
              <Link
                to="/support"
                className={buttonClass("outline", "sm", "mt-4 w-full")}
              >
                View full fee schedule
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
