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
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isCredit
              ? "bg-green-50 text-positive-600"
              : "bg-ink-100 text-ink-600",
          )}
          aria-hidden="true"
        >
          {isCredit ? "↓" : "↑"}
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
            "text-sm font-semibold",
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
