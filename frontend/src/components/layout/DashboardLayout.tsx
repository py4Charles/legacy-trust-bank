import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "grid" },
  { label: "Accounts", to: "/dashboard/accounts", icon: "wallet" },
  { label: "Payments", to: "/dashboard/payments", icon: "send" },
  { label: "Cards", to: "/dashboard/cards", icon: "card" },
  { label: "Approvals", to: "/dashboard/approvals", icon: "check", badge: 2 },
  { label: "Settings", to: "/dashboard/settings", icon: "cog" },
];

const icons: Record<string, JSX.Element> = {
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M16 12h2" />
    </>
  ),
  send: <path d="m3 11 18-8-8 18-2-8-8-2Z" />,
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5" />
    </>
  ),
};

function NavIcon({ name }: { name: string }) {
  return (
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
      {icons[name]}
    </svg>
  );
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-brand-600 text-white"
        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
    );

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Logo />
      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <NavIcon name={item.icon} />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-accent-500 px-2 text-xs font-bold text-ink-950">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div className="rounded-lg bg-ink-100 p-3 text-xs text-ink-500">
        <p className="font-semibold text-ink-700">Two-factor enabled</p>
        <p className="mt-1">Your session locks after 10 minutes of inactivity.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:block">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 lg:hidden"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-ink-900">
                Welcome back, {user?.name.split(" ")[0]}
              </p>
              <p className="text-xs text-ink-500">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="brand" className="hidden sm:inline-flex">
              {user?.role}
            </Badge>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-600 hover:bg-ink-100"
              aria-label={`Notifications (${unread} unread)`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-negative-600" />
              )}
            </button>
            <div className="mx-1 hidden h-6 w-px bg-ink-200 sm:block" />
            <Link
              to="/"
              className="hidden text-sm font-medium text-ink-600 hover:text-ink-900 sm:block"
            >
              Public site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-negative-600 hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
