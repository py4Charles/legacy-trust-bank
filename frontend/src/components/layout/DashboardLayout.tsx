import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "grid" },
  { label: "Accounts", to: "/dashboard/accounts", icon: "wallet" },
  { label: "Payments", to: "/dashboard/payments", icon: "send" },
  { label: "Cards", to: "/dashboard/cards", icon: "card" },
  { label: "Approvals", to: "/dashboard/approvals", icon: "check", badge: 2 },
  { label: "Settings", to: "/dashboard/settings", icon: "cog" },
];

const iconPaths: Record<string, React.ReactNode> = {
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
      {iconPaths[name]}
    </svg>
  );
}

const severityDot: Record<NotificationItem["severity"], string> = {
  info: "bg-brand-500",
  warning: "bg-accent-500",
  critical: "bg-negative-600",
};

function greeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const unread = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [],
  );
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
        : "text-ink-600 hover:bg-ink-100/70 hover:text-ink-900",
    );

  const sidebar = (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30"
                      : "bg-ink-100 text-ink-500 group-hover:bg-white group-hover:text-brand-600",
                  )}
                >
                  <NavIcon name={item.icon} />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-bold text-ink-950">
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 p-4 text-white shadow-lg shadow-ink-950/20">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-[11px] text-white/60">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 text-accent-400"
              aria-hidden="true"
            >
              <path d="M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z" />
            </svg>
            2FA enabled
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-2 py-1 font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-white/85 px-4 backdrop-blur-lg sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {greeting(new Date())}, {user?.name.split(" ")[0]}
              </p>
              <p className="text-xs text-ink-500">
                {new Date().toLocaleDateString("en-ZA", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="brand" className="hidden sm:inline-flex">
              {user?.role}
            </Badge>

            <div className="relative">
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100"
                aria-label={`Notifications (${unread} unread)`}
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((open) => !open)}
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
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-negative-600 ring-2 ring-white" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotifOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-12 z-20 w-80 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xl animate-fade-up">
                    <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">
                        Notifications
                      </p>
                      <Badge tone="warning">{unread} new</Badge>
                    </div>
                    <ul className="max-h-96 divide-y divide-ink-100 overflow-y-auto">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                severityDot[notification.severity],
                              )}
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "text-sm",
                                  notification.read
                                    ? "font-medium text-ink-600"
                                    : "font-semibold text-ink-900",
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                                {notification.body}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="mx-1 hidden h-6 w-px bg-ink-200 sm:block" />
            <Link
              to="/"
              className="hidden text-sm font-medium text-ink-600 transition-colors hover:text-brand-700 sm:block"
            >
              Public site
            </Link>
          </div>
        </header>

        <AnnouncementBanner />

        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}