import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { approvalsApi } from "@/api";
import { useAsync } from "@/lib/useAsync";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PendingApproval } from "@/types";

const typeLabels: Record<PendingApproval["type"], string> = {
  payment: "Payment",
  beneficiary: "Beneficiary",
  "limit-change": "Limit change",
};

const typeTone: Record<PendingApproval["type"], "brand" | "positive" | "warning"> = {
  payment: "brand",
  beneficiary: "positive",
  "limit-change": "warning",
};

interface DecisionRecord {
  id: string;
  title: string;
  decision: "approved" | "rejected";
}

export function ApprovalsPage() {
  const approvalsState = useAsync(() => approvalsApi.list(), []);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (approvalsState.data) setApprovals(approvalsState.data);
  }, [approvalsState.data]);

  const decide = async (
    approval: PendingApproval,
    decision: "approved" | "rejected",
  ) => {
    setPendingId(approval.id);
    setError(null);
    try {
      await approvalsApi.decide(
        approval.id,
        decision === "approved" ? "authorise" : "reject",
      );
      setApprovals((prev) => prev.filter((item) => item.id !== approval.id));
      setDecisions((prev) => [
        { id: approval.id, title: approval.title, decision },
        ...prev,
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not record your decision",
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Approvals"
        title="Dual authorisation queue"
        description="Items captured by other users that need a second pair of eyes before they're executed."
      />

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm text-accent-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
        <p className="leading-relaxed">
          Dual authorisation is enabled. You cannot approve items you captured
          yourself, and every decision is written to the immutable audit log.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-negative-600"
        >
          {error}
        </p>
      )}

      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Awaiting authorisation</CardTitle>
          <Badge tone="warning">{approvals.length} pending</Badge>
        </CardHeader>
        {approvalsState.loading ? (
          <CardBody className="py-10 text-center text-sm text-ink-500">
            Loading approvals…
          </CardBody>
        ) : approvals.length > 0 ? (
          <div className="divide-y divide-ink-100">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-ink-50/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">
                      {approval.title}
                    </p>
                    <Badge tone={typeTone[approval.type]}>
                      {typeLabels[approval.type]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    Captured {formatDateTime(approval.submittedAt)}
                  </p>
                  {approval.amount > 0 && (
                    <p className="mt-1 text-sm font-semibold tabular-nums text-ink-900">
                      {formatCurrency(approval.amount)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    disabled={pendingId === approval.id}
                    onClick={() => decide(approval, "approved")}
                  >
                    Authorise
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingId === approval.id}
                    onClick={() => decide(approval, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CardBody className="flex flex-col items-center gap-3 py-12 text-sm text-ink-500">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-positive-600 ring-1 ring-emerald-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12 2.5 2.5 4.5-5" />
              </svg>
            </span>
            <p className="font-medium text-ink-700">
              Nothing awaiting authorisation.
            </p>
            <p>You're all caught up.</p>
          </CardBody>
        )}
      </Card>

      {decisions.length > 0 && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Your recent decisions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            {decisions.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-0"
              >
                <span className="font-medium text-ink-700">{record.title}</span>
                <Badge
                  tone={record.decision === "approved" ? "positive" : "danger"}
                >
                  {record.decision === "approved" ? "Authorised" : "Rejected"}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
