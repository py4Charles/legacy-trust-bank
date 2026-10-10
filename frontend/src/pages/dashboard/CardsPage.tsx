import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cards as seedCards } from "@/data/mock";
import { formatCurrency, maskCardNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentCard } from "@/types";

export function CardsPage() {
  const [cards, setCards] = useState<PaymentCard[]>(seedCards);

  const toggleFreeze = (id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, status: card.status === "blocked" ? "active" : "blocked" }
          : card,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cards</h1>
        <p className="mt-1 text-sm text-ink-600">
          Control your cards, set limits and freeze them instantly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => {
          const usage = Math.min(
            100,
            Math.round((card.spentThisMonth / card.monthlyLimit) * 100),
          );
          const blocked = card.status === "blocked";

          return (
            <Card key={card.id}>
              <CardBody className="space-y-5">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl p-5 text-white",
                    card.type === "credit"
                      ? "bg-gradient-to-br from-ink-900 to-brand-800"
                      : "bg-gradient-to-br from-brand-800 to-brand-600",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">
                        {card.label}
                      </p>
                      <p className="mt-4 font-mono text-lg tracking-widest">
                        {maskCardNumber(card.last4)}
                      </p>
                    </div>
                    <Badge tone="light">
                      {blocked ? "Frozen" : "Active"}
                    </Badge>
                  </div>
                  <div className="mt-6 flex items-end justify-between text-sm">
                    <span className="text-white/70">
                      {card.type === "credit" ? "Credit" : "Debit"}
                    </span>
                    <span className="text-white/70">Expires {card.expiry}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-600">Monthly spend</span>
                    <span className="font-medium text-ink-900">
                      {formatCurrency(card.spentThisMonth)} /{" "}
                      {formatCurrency(card.monthlyLimit)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={cn(
                        "h-full rounded-full",
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
                    onClick={() => toggleFreeze(card.id)}
                  >
                    {blocked ? "Unfreeze card" : "Freeze card"}
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

      <Card>
        <CardHeader>
          <CardTitle>Card security tips</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 text-sm text-ink-600 sm:grid-cols-3">
          <p>Freeze a card instantly if it's lost — no need to cancel it.</p>
          <p>Set lower limits for online shopping to reduce your risk.</p>
          <p>Only enter your PIN on terminals you trust and shield the keypad.</p>
        </CardBody>
      </Card>
    </div>
  );
}
