import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { pendingApprovals as seedApprovals } from "@/data/mock";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PendingApproval } from "@/types";

const typeLabels: Record<PendingApproval["type"], string> = {
  payment: "Payment",
  beneficiary: "Beneficiary",
  "limit-change": "Limit change",
};

export function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApproval[]>(seedApprovals);
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>(
    {},
  );

  const decide = (id: string, decision: "approved" | "rejected") => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="mt-1 text-sm text-ink-600">
          Items captured by other users that need a second authoriser.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3 text-sm text-accent-600">
          <span aria-hidden="true" className="text-lg leading-none">
            ⚠
          </span>
          <p>
            Dual authorisation is enabled. You cannot approve items you captured
            yourself. All decisions are written to the immutable audit log.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Awaiting authorisation</CardTitle>
          <Badge tone="warning">{approvals.length} pending</Badge>
        </CardHeader>
        {approvals.length > 0 ? (
          <div className="divide-y divide-ink-100">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">
                      {approval.title}
                    </p>
                    <Badge>{typeLabels[approval.type]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    Captured by {approval.submittedBy} ·{" "}
                    {formatDateTime(approval.submittedAt)}
                  </p>
                  {approval.amount > 0 && (
                    <p className="mt-1 text-sm font-semibold text-ink-900">
                      {formatCurrency(approval.amount)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => decide(approval.id, "approved")}
                  >
                    Authorise
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decide(approval.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CardBody className="py-10 text-center text-sm text-ink-500">
            Nothing awaiting authorisation. You're all caught up.
          </CardBody>
        )}
      </Card>

      {Object.keys(decisions).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your recent decisions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            {Object.entries(decisions).map(([id, decision]) => {
              const original = seedApprovals.find((a) => a.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-0"
                >
                  <span className="text-ink-700">{original?.title}</span>
                  <Badge
                    tone={decision === "approved" ? "positive" : "danger"}
                  >
                    {decision}
                  </Badge>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
