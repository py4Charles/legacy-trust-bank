import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { accountsApi, approvalsApi, transactionsApi } from "@/api";
import { useAsync } from "@/lib/useAsync";
import { useAuthStore } from "@/store/auth";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function DashboardHome() {
  const user = useAuthStore((s) => s.user);

  const accountsState = useAsync(() => accountsApi.list(), []);
  const transactionsState = useAsync(() => transactionsApi.list(50), []);
  const approvalsState = useAsync(() => approvalsApi.list(), []);

  const accounts = accountsState.data ?? [];
  const transactions = transactionsState.data ?? [];
  const pendingApprovals = approvalsState.data ?? [];

  const recent = [...transactions]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);

  const totalBalance = accounts
    .filter((a) => a.type !== "credit")
    .reduce((sum, account) => sum + account.balance, 0);

  const first = user?.name.split(" ")[0] ?? "there";

  const quickActions = [
    {
      label: "Send money",
      caption: "Instant & scheduled",
      to: "/dashboard/payments",
      path: "M3 11l18-8-8 18-2-8-8-2Z",
    },
    {
      label: "Pay bills",
      caption: "Electricity, water & more",
      to: "/dashboard/payments",
      path: "M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z",
    },
    {
      label: "Cards",
      caption: "Freeze, limits & PIN",
      to: "/dashboard/cards",
      path: "M3 5h18v14H3zM3 10h18",
    },
    {
      label: "Approvals",
      caption: `${pendingApprovals.length} waiting for review`,
      to: "/dashboard/approvals",
      path: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M8.5 12l2.5 2.5 4.5-5",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-6 text-white shadow-lg shadow-brand-900/20 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-white/70">
              Welcome back, {first}
            </p>
            <p className="mt-2 text-sm text-white/60">Total balance across accounts</p>
            <p className="mt-1 bg-gradient-to-r from-white to-brand-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              to="/dashboard/payments"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-700 shadow-lg shadow-ink-950/20 transition-all hover:bg-brand-50 active:scale-[0.98]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Make a payment
            </Link>
            <Link
              to="/dashboard/accounts"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              View statements →
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 ring-1 ring-brand-100 transition-colors group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
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
                <path d={action.path} />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink-800">
                {action.label}
              </span>
              <span className="block truncate text-xs text-ink-500">
                {action.caption}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Your accounts</h2>
          <Link
            to="/dashboard/accounts"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Manage accounts
          </Link>
        </div>
        {accountsState.loading ? (
          <p className="text-sm text-ink-500">Loading accounts…</p>
        ) : accounts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-500">No accounts yet.</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <Link
              to="/dashboard/accounts"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all
            </Link>
          </CardHeader>
          <div className="divide-y divide-ink-100">
            {recent.length > 0 ? (
              recent.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <p className="px-5 py-10 text-center text-sm text-ink-500">
                {transactionsState.loading
                  ? "Loading transactions…"
                  : "No transactions yet."}
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Pending approvals</CardTitle>
              <Badge tone="warning">
                {pendingApprovals.length} waiting
              </Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-ink-100 p-3.5 transition-colors hover:border-amber-200 hover:bg-amber-50/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {approval.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {formatDateTime(approval.submittedAt)}
                      </p>
                    </div>
                    {approval.amount > 0 && (
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-900">
                        {formatCurrency(approval.amount)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-ink-500">
                  Nothing awaiting authorisation.
                </p>
              )}
              <Link
                to="/dashboard/approvals"
                className={buttonClass("outline", "sm", "w-full")}
              >
                Review approvals
              </Link>
            </CardBody>
          </Card>

          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Security status</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Two-factor auth</span>
                <Badge tone="positive">On</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Session protection</span>
                <Badge tone="positive">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Account role</span>
                <span className="font-medium capitalize text-ink-900">
                  {user?.role ?? "—"}
                </span>
              </div>
              <Link
                to="/dashboard/settings"
                className={buttonClass("outline", "sm", "w-full")}
              >
                Security settings
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
