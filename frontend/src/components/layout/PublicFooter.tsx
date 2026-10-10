import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Banking",
    links: [
      { label: "Current Accounts", to: "/products/accounts" },
      { label: "Savings", to: "/products/savings" },
      { label: "Loans", to: "/products/loans" },
      { label: "Cards", to: "/products/cards" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", to: "/support" },
      { label: "Security Centre", to: "/security" },
      { label: "Report Fraud", to: "/security" },
      { label: "Contact Us", to: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/support" },
      { label: "Terms of Use", to: "/support" },
      { label: "Cookie Settings", to: "/support" },
      { label: "Rates & Fees", to: "/support" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-950 text-ink-300">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-ink-400">
            Secure, transparent banking for individuals and businesses. Regulated
            by the Financial Sector Conduct Authority.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-ink-700 px-3 py-1">
              256-bit encryption
            </span>
            <span className="rounded-full border border-ink-700 px-3 py-1">
              PCI-DSS compliant
            </span>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">
              {column.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-ink-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-ink-800">
        <Container className="flex flex-col justify-between gap-3 py-5 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Legacy Trust Bank. All rights reserved.</p>
          <p>
            Legacy Trust Bank Ltd is a registered financial services provider
            (FSP 12345).
          </p>
        </Container>
      </div>
    </footer>
  );
}
