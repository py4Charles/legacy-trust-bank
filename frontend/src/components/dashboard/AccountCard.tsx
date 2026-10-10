import { Link } from "react-router-dom";
import type { Account } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const typeLabels: Record<Account["type"], string> = {
  cheque: "Cheque",
  savings: "Savings",
  credit: "Credit",
  investment: "Investment",
};

const typeTones: Record<Account["type"], "brand" | "positive" | "warning" | "neutral"> = {
  cheque: "brand",
  savings: "positive",
  credit: "warning",
  investment: "neutral",
};

export function AccountCard({ account }: { account: Account }) {
  const isCredit = account.type === "credit";

  return (
    <Link
      to="/dashboard/accounts"
      className="block rounded-xl border border-ink-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge tone={typeTones[account.type]}>{typeLabels[account.type]}</Badge>
        <span className="text-xs text-ink-400">{account.number}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-ink-600">{account.name}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          account.balance < 0 ? "text-negative-600" : "text-ink-900",
        )}
      >
        {formatCurrency(account.balance)}
      </p>
      <p className="mt-1 text-xs text-ink-500">
        {isCredit ? "Available credit" : "Available"}: {" "}
        {formatCurrency(account.available)}
      </p>
    </Link>
  );
}
