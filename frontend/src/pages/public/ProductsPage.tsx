import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";
import { NotFoundPage } from "./NotFoundPage";
import { productCategories, products } from "@/data/mock";
import type { ProductCategory } from "@/types";

export function ProductsPage() {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = productCategories.find((c) => c.id === category);

  if (!categoryInfo) {
    return <NotFoundPage />;
  }

  const categoryProducts = products.filter(
    (p) => p.category === (category as ProductCategory),
  );

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={categoryInfo.label}
        description={categoryInfo.description}
      />

      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {productCategories.map((c) => (
            <Link
              key={c.id}
              to={`/products/${c.id}`}
              className={
                c.id === category
                  ? buttonClass("primary", "sm")
                  : buttonClass("outline", "sm")
              }
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categoryProducts.map((product) => (
            <Card
              key={product.slug}
              className="flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold text-ink-900">
                    {product.name}
                  </h2>
                  {product.featured && <Badge tone="brand">Popular</Badge>}
                </div>
                <p className="mt-2 text-sm text-ink-600">
                  {product.description}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
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
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-4">
                  <span className="text-sm font-semibold text-ink-900">
                    {product.monthlyFee}
                  </span>
                  <Link
                    to={`/products/${product.category}/${product.slug}`}
                    className={buttonClass("primary", "sm")}
                  >
                    View details
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
