import type { Card } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";
import { fromCents } from "../../lib/money";

export interface SerializedCard {
  id: string;
  accountId: string;
  label: string;
  last4: string;
  maskedNumber: string;
  type: string;
  status: string;
  expiry: string;
  monthlyLimitCents: number;
  monthlyLimit: number;
  spentThisMonthCents: number;
  spentThisMonth: number;
  usagePercent: number;
}

export function serializeCard(card: Card): SerializedCard {
  return {
    id: card.id,
    accountId: card.accountId,
    label: card.label,
    last4: card.last4,
    maskedNumber: `•••• •••• •••• ${card.last4}`,
    type: card.type,
    status: card.status,
    expiry: card.expiry,
    monthlyLimitCents: card.monthlyLimitCents,
    monthlyLimit: fromCents(card.monthlyLimitCents),
    spentThisMonthCents: card.spentThisMonthCents,
    spentThisMonth: fromCents(card.spentThisMonthCents),
    usagePercent:
      card.monthlyLimitCents > 0
        ? Math.min(
            100,
            Math.round(
              (card.spentThisMonthCents / card.monthlyLimitCents) * 100,
            ),
          )
        : 0,
  };
}

async function assertOwnedCard(userId: string, cardId: string): Promise<Card> {
  const card = await prisma.card.findFirst({
    where: { id: cardId, account: { userId } },
  });
  if (!card) throw notFound("Card not found");
  return card;
}

export async function listCards(userId: string): Promise<Card[]> {
  return prisma.card.findMany({
    where: { account: { userId } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCard(userId: string, cardId: string): Promise<Card> {
  return assertOwnedCard(userId, cardId);
}

export async function setCardStatus(
  userId: string,
  cardId: string,
  status: "active" | "blocked",
): Promise<Card> {
  const card = await assertOwnedCard(userId, cardId);
  return prisma.card.update({ where: { id: card.id }, data: { status } });
}

export async function updateCardLimit(
  userId: string,
  cardId: string,
  monthlyLimitCents: number,
): Promise<Card> {
  const card = await assertOwnedCard(userId, cardId);
  return prisma.card.update({
    where: { id: card.id },
    data: { monthlyLimitCents },
  });
}
