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

const accentByType: Record<
  Account["type"],
  { bg: string; chip: string }
> = {
  cheque: { bg: "from-brand-500 to-brand-700", chip: "bg-brand-600" },
  savings: { bg: "from-emerald-500 to-positive-700", chip: "bg-emerald-600" },
  credit: { bg: "from-amber-400 to-accent-600", chip: "bg-accent-600" },
  investment: { bg: "from-ink-500 to-ink-800", chip: "bg-ink-700" },
};

export function AccountCard({ account }: { account: Account }) {
  const isCredit = account.type === "credit";
  const accent = accentByType[account.type];

  return (
    <Link
      to="/dashboard/accounts"
      className="group relative block overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          accent.bg,
        )}
      />
      <div className="relative flex items-center justify-between gap-3">
        <Badge tone={typeTones[account.type]}>{typeLabels[account.type]}</Badge>
        <span className="text-xs font-medium tracking-wide text-ink-400">
          {account.number}
        </span>
      </div>

      <p className="relative mt-3 text-sm font-medium text-ink-600">
        {account.name}
      </p>
      <p
        className={cn(
          "relative mt-0.5 text-[1.75rem] font-bold leading-tight tracking-tight",
          account.balance < 0 ? "text-negative-600" : "text-ink-900",
        )}
      >
        {formatCurrency(account.balance)}
      </p>

      <div className="relative mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <p className="text-xs text-ink-500">
          {isCredit ? "Available credit" : "Available"}:{" "}
          <span className="font-semibold text-ink-700">
            {formatCurrency(account.available)}
          </span>
        </p>
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 rounded-full", accent.chip)}
        />
      </div>
    </Link>
  );
}