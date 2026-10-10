import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { accounts, transactions } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AccountsPage() {
  const [selectedId, setSelectedId] = useState(accounts[0].id);

  const selected = accounts.find((a) => a.id === selectedId)!;
  const accountTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.accountId === selectedId)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [selectedId],
  );

  const inflow = accountTransactions
    .filter((t) => t.direction === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const outflow = accountTransactions
    .filter((t) => t.direction === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <p className="mt-1 text-sm text-ink-600">
          Balances, transaction history and statements.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {accounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => setSelectedId(account.id)}
            className={cn(
              "rounded-xl border bg-white p-4 text-left transition-colors",
              account.id === selectedId
                ? "border-brand-500 ring-2 ring-brand-500/20"
                : "border-ink-200 hover:border-ink-300",
            )}
          >
            <p className="text-sm font-medium text-ink-600">{account.name}</p>
            <p
              className={cn(
                "mt-1 text-lg font-bold",
                account.balance < 0 ? "text-negative-600" : "text-ink-900",
              )}
            >
              {formatCurrency(account.balance)}
            </p>
            <p className="mt-0.5 text-xs text-ink-400">{account.number}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{selected.name}</CardTitle>
              <p className="mt-0.5 text-xs text-ink-500">{selected.number}</p>
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
                No transactions in this period.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Activity summary</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  Money in
                </p>
                <p className="mt-1 text-lg font-semibold text-positive-600">
                  {formatCurrency(inflow)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  Money out
                </p>
                <p className="mt-1 text-lg font-semibold text-negative-600">
                  {formatCurrency(outflow)}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="text-sm text-ink-600">Net movement</span>
                <Badge tone={inflow - outflow >= 0 ? "positive" : "danger"}>
                  {formatCurrency(inflow - outflow)}
                </Badge>
              </div>
            </CardBody>
          </Card>
        </div>
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
