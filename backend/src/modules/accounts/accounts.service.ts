import type { Account, Transaction } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";
import { fromCents } from "../../lib/money";

export interface SerializedAccount {
  id: string;
  name: string;
  type: string;
  number: string;
  currency: string;
  balanceCents: number;
  balance: number;
  availableCents: number;
  available: number;
}

export interface SerializedTransaction {
  id: string;
  accountId: string;
  description: string;
  category: string;
  direction: string;
  amountCents: number;
  amount: number;
  status: string;
  balanceAfterCents: number | null;
  balanceAfter: number | null;
  createdAt: Date;
}

export function serializeAccount(account: Account): SerializedAccount {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    number: account.number,
    currency: account.currency,
    balanceCents: account.balanceCents,
    balance: fromCents(account.balanceCents),
    availableCents: account.availableCents,
    available: fromCents(account.availableCents),
  };
}

export function serializeTransaction(
  transaction: Transaction,
): SerializedTransaction {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    description: transaction.description,
    category: transaction.category,
    direction: transaction.direction,
    amountCents: transaction.amountCents,
    amount: fromCents(transaction.amountCents),
    status: transaction.status,
    balanceAfterCents: transaction.balanceAfterCents,
    balanceAfter:
      transaction.balanceAfterCents === null
        ? null
        : fromCents(transaction.balanceAfterCents),
    createdAt: transaction.createdAt,
  };
}

export async function listAccounts(userId: string): Promise<Account[]> {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getOwnedAccount(
  userId: string,
  accountId: string,
): Promise<Account> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });
  if (!account) throw notFound("Account not found");
  return account;
}

export async function listAccountTransactions(
  userId: string,
  accountId: string,
  limit = 50,
): Promise<Transaction[]> {
  await getOwnedAccount(userId, accountId);
  return prisma.transaction.findMany({
    where: { accountId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
