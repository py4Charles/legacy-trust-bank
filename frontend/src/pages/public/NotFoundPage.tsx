import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/buttonStyles";

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        We couldn't find that page
      </h1>
      <p className="mt-3 max-w-md text-ink-600">
        The page may have moved, or the link you followed might be broken.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClass("primary", "md")}>
          Back to home
        </Link>
        <Link to="/support" className={buttonClass("outline", "md")}>
          Get help
        </Link>
      </div>
    </Container>
  );
}
