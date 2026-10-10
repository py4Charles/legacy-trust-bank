import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/buttonStyles";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Accounts", to: "/products/accounts" },
  { label: "Savings", to: "/products/savings" },
  { label: "Loans", to: "/products/loans" },
  { label: "Cards", to: "/products/cards" },
  { label: "Support", to: "/support" },
  { label: "Security", to: "/security" },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "text-brand-700"
        : "text-ink-600 hover:text-ink-900",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              to="/dashboard"
              className={buttonClass("primary", "sm", "px-5")}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700"
              >
                Log in
              </Link>
              <Link to="/register" className={buttonClass("primary", "sm", "px-5")}>
                Open an Account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M6 18 18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-ink-100 bg-white pb-4 shadow-card lg:hidden">
          <Container className="flex flex-col pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                  )
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className={buttonClass("primary", "md")}
                  onClick={() => setMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className={buttonClass("primary", "md")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Open an Account
                  </Link>
                  <Link
                    to="/login"
                    className={buttonClass("outline", "md")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}