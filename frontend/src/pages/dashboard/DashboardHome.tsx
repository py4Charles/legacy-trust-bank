import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { accounts, pendingApprovals, transactions } from "@/data/mock";
import { formatCurrency, formatDateTime } from "@/lib/format";

const quickActions = [
  { label: "Transfer", to: "/dashboard/payments", icon: "↗" },
  { label: "Pay Bills", to: "/dashboard/payments", icon: "▤" },
  { label: "Buy Airtime", to: "/dashboard/payments", icon: "▮" },
  { label: "New Recipient", to: "/dashboard/payments", icon: "＋" },
];

export function DashboardHome() {
  const recent = [...transactions]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);

  const totalBalance = accounts
    .filter((a) => a.type !== "credit")
    .reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-ink-600">
            Total across accounts: {" "}
            <span className="font-semibold text-ink-900">
              {formatCurrency(totalBalance)}
            </span>
          </p>
        </div>
        <Link to="/dashboard/payments" className={buttonClass("primary", "md")}>
          Make a payment
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-lg text-brand-700">
              {action.icon}
            </span>
            <span className="text-sm font-semibold text-ink-800">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your accounts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <Link
              to="/dashboard/accounts"
              className="text-sm font-semibold text-brand-700"
            >
              View all
            </Link>
          </CardHeader>
          <div className="divide-y divide-ink-100">
            {recent.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending approvals</CardTitle>
              <Badge tone="warning">{pendingApprovals.length}</Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="rounded-lg border border-ink-100 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-ink-900">
                      {approval.title}
                    </p>
                    {approval.amount > 0 && (
                      <span className="shrink-0 text-sm font-semibold">
                        {formatCurrency(approval.amount)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    {approval.submittedBy} · {formatDateTime(approval.submittedAt)}
                  </p>
                </div>
              ))}
              <Link
                to="/dashboard/approvals"
                className={buttonClass("outline", "sm", "w-full")}
              >
                Review approvals
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Two-factor auth</span>
                <Badge tone="positive">On</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Last login</span>
                <span className="text-ink-900">Today, 18:40</span>
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
