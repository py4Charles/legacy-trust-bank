import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { accountsApi } from "@/api";
import { useAsync } from "@/lib/useAsync";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const accentByType: Record<string, { bar: string; active: string }> = {
  cheque: {
    bar: "from-brand-500 to-brand-700",
    active: "border-brand-500 ring-2 ring-brand-500/20",
  },
  savings: {
    bar: "from-emerald-500 to-positive-700",
    active: "border-emerald-500 ring-2 ring-emerald-500/20",
  },
  credit: {
    bar: "from-amber-400 to-accent-600",
    active: "border-amber-500 ring-2 ring-amber-500/20",
  },
  investment: {
    bar: "from-ink-500 to-ink-800",
    active: "border-ink-500 ring-2 ring-ink-500/20",
  },
};

export function AccountsPage() {
  const accountsState = useAsync(() => accountsApi.list(), []);
  const accounts = accountsState.data ?? [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? accounts[0]?.id ?? null;

  const transactionsState = useAsync(
    () => (activeId ? accountsApi.transactions(activeId) : Promise.resolve([])),
    [activeId],
  );
  const accountTransactions = transactionsState.data ?? [];

  const selected = accounts.find((account) => account.id === activeId);

  const inflow = accountTransactions
    .filter((t) => t.direction === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const outflow = accountTransactions
    .filter((t) => t.direction === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  const net = inflow - outflow;
  const maxFlow = Math.max(inflow, outflow, 1);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Accounts"
        title="Your money, all in one place"
        description="Balances, transaction history and activity insights across every account."
      />

      {accountsState.loading ? (
        <p className="text-sm text-ink-500">Loading accounts…</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-ink-500">You don't have any accounts yet.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelectedId(account.id)}
                aria-pressed={account.id === activeId}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-white p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5",
                  account.id === activeId
                    ? accentByType[account.type].active
                    : "border-ink-100 hover:border-ink-200 hover:shadow-card-hover",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    accentByType[account.type].bar,
                  )}
                />
                <p className="text-sm font-medium text-ink-600">{account.name}</p>
                <p
                  className={cn(
                    "mt-1 text-lg font-bold tracking-tight",
                    account.balance < 0 ? "text-negative-600" : "text-ink-900",
                  )}
                >
                  {formatCurrency(account.balance)}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{account.number}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <Card className="animate-fade-up">
                <CardHeader>
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {selected.number}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download statement
                  </Button>
                </CardHeader>
                <div className="divide-y divide-ink-100">
                  {accountTransactions.length > 0 ? (
                    accountTransactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))
                  ) : (
                    <p className="px-5 py-10 text-center text-sm text-ink-500">
                      {transactionsState.loading
                        ? "Loading transactions…"
                        : "No transactions in this period."}
                    </p>
                  )}
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="animate-fade-up">
                  <CardHeader>
                    <CardTitle>Account details</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3 text-sm">
                    <Row label="Account type" value={selected.type} capitalize />
                    <Row label="Currency" value={selected.currency} />
                    <Row
                      label="Current balance"
                      value={formatCurrency(selected.balance)}
                    />
                    <Row
                      label="Available balance"
                      value={formatCurrency(selected.available)}
                    />
                  </CardBody>
                </Card>

                <Card className="animate-fade-up">
                  <CardHeader>
                    <CardTitle>Activity summary</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-5">
                    <FlowRow
                      label="Money in"
                      value={formatCurrency(inflow)}
                      color="text-positive-600"
                      width={Math.max(8, (inflow / maxFlow) * 100)}
                      barClass="bg-emerald-500"
                    />
                    <FlowRow
                      label="Money out"
                      value={formatCurrency(outflow)}
                      color="text-ink-900"
                      width={Math.max(8, (outflow / maxFlow) * 100)}
                      barClass="bg-ink-300"
                    />
                    <div className="flex items-center justify-between border-t border-ink-100 pt-3">
                      <span className="text-sm text-ink-600">Net movement</span>
                      <Badge tone={net >= 0 ? "positive" : "danger"}>
                        {net >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(net))}
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FlowRow({
  label,
  value,
  color,
  width,
  barClass,
}: {
  label: string;
  value: string;
  color: string;
  width: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-600">{label}</span>
        <span className={cn("font-semibold tabular-nums", color)}>{value}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-500">{label}</span>
      <span className={cn("font-medium text-ink-900", capitalize && "capitalize")}>
        {value}
      </span>
    </div>
  );
}
