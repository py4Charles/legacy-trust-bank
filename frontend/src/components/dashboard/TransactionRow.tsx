import type { Transaction } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusTones: Record<Transaction["status"], "positive" | "warning" | "danger"> = {
  posted: "positive",
  pending: "warning",
  failed: "danger",
};

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.direction === "credit";

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-ink-50/70">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isCredit ? "bg-emerald-50 text-positive-600 ring-1 ring-emerald-100" : "bg-ink-100 text-ink-600 ring-1 ring-ink-200/70",
          )}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            {isCredit ? (
              <>
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </>
            ) : (
              <>
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </>
            )}
          </svg>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink-900">
            {transaction.description}
          </p>
          <p className="text-xs text-ink-500">
            {formatDate(transaction.date)} · {transaction.category}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isCredit ? "text-positive-600" : "text-ink-900",
          )}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        {transaction.status !== "posted" && (
          <Badge tone={statusTones[transaction.status]}>
            {transaction.status}
          </Badge>
        )}
      </div>
    </div>
  );
}