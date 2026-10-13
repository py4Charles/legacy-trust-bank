import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { cardsApi } from "@/api";
import { useAsync } from "@/lib/useAsync";
import { formatCurrency, maskCardNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentCard } from "@/types";

export function CardsPage() {
  const cardsState = useAsync(() => cardsApi.list(), []);
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cardsState.data) setCards(cardsState.data);
  }, [cardsState.data]);

  const toggleFreeze = async (card: PaymentCard) => {
    setPendingId(card.id);
    setError(null);
    try {
      const updated = await cardsApi.setFrozen(card.id, card.status !== "blocked");
      setCards((prev) =>
        prev.map((current) => (current.id === updated.id ? updated : current)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update the card",
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Cards"
        title="Control every card in seconds"
        description="Freeze instantly, review limits and manage spending across your physical and virtual cards."
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-negative-600"
        >
          {error}
        </p>
      )}

      {cardsState.loading ? (
        <p className="text-sm text-ink-500">Loading cards…</p>
      ) : cards.length === 0 ? (
        <p className="text-sm text-ink-500">You don't have any cards yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const usage =
              card.monthlyLimit > 0
                ? Math.min(
                    100,
                    Math.round(
                      (card.spentThisMonth / card.monthlyLimit) * 100,
                    ),
                  )
                : 0;
            const blocked = card.status === "blocked";

            return (
              <Card key={card.id} className="animate-fade-up">
                <CardBody className="space-y-5">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-6 text-white shadow-xl",
                      card.type === "credit"
                        ? "bg-gradient-to-br from-ink-900 via-ink-950 to-brand-900"
                        : "bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950",
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-2xl"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent-500/20 blur-3xl"
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                          {card.label}
                        </p>
                        <p className="mt-5 font-mono text-xl tracking-[0.18em]">
                          {maskCardNumber(card.last4)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge tone={blocked ? "danger" : "light"}>
                          {blocked ? "Frozen" : "Active"}
                        </Badge>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-white/70"
                          aria-hidden="true"
                        >
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative mt-6 flex items-end justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-white/70"
                          aria-hidden="true"
                        >
                          <path d="M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z" />
                        </svg>
                        <span className="font-medium text-white">
                          Legacy Trust
                        </span>
                      </span>
                      <span className="text-white/70">
                        {card.type === "credit" ? "Credit" : "Debit"} · Exp{" "}
                        {card.expiry}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-600">Monthly spend</span>
                      <span className="font-medium tabular-nums text-ink-900">
                        {formatCurrency(card.spentThisMonth)} of{" "}
                        {formatCurrency(card.monthlyLimit)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          usage > 85 ? "bg-negative-600" : "bg-brand-600",
                        )}
                        style={{ width: `${usage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={blocked ? "primary" : "danger"}
                      size="sm"
                      disabled={pendingId === card.id}
                      onClick={() => toggleFreeze(card)}
                    >
                      {pendingId === card.id
                        ? "Updating…"
                        : blocked
                          ? "Unfreeze card"
                          : "Freeze card"}
                    </Button>
                    <Button variant="outline" size="sm">
                      Change limits
                    </Button>
                    <Button variant="ghost" size="sm">
                      View PIN
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Card security tips</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 text-sm text-ink-600 sm:grid-cols-3">
          <div className="flex gap-3 rounded-xl border border-ink-100 p-4">
            <span aria-hidden="true" className="text-brand-600">⏸</span>
            <p>Freeze a card instantly if it's lost — no need to cancel it.</p>
          </div>
          <div className="flex gap-3 rounded-xl border border-ink-100 p-4">
            <span aria-hidden="true" className="text-brand-600">↧</span>
            <p>Set lower limits for online shopping to reduce your risk.</p>
          </div>
          <div className="flex gap-3 rounded-xl border border-ink-100 p-4">
            <span aria-hidden="true" className="text-brand-600">⌨</span>
            <p>Only enter your PIN on terminals you trust and shield the keypad.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
