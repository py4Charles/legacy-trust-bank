import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok } from "../../lib/response";
import { authenticate } from "../../middleware/auth";
import {
  getOwnedAccount,
  listAccountTransactions,
  listAccounts,
  serializeAccount,
  serializeTransaction,
} from "./accounts.service";

const limitQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const accountsRouter = Router();

accountsRouter.use(authenticate);

accountsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const accounts = await listAccounts(req.user!.id);
    ok(res, { accounts: accounts.map(serializeAccount) });
  }),
);

accountsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const account = await getOwnedAccount(req.user!.id, req.params.id);
    ok(res, { account: serializeAccount(account) });
  }),
);

accountsRouter.get(
  "/:id/transactions",
  asyncHandler(async (req, res) => {
    const { limit } = limitQuery.parse(req.query);
    const transactions = await listAccountTransactions(
      req.user!.id,
      req.params.id,
      limit,
    );
    ok(res, { transactions: transactions.map(serializeTransaction) });
  }),
);

accountsRouter.get(
  "/:id/statement",
  asyncHandler(async (req, res) => {
    const account = await getOwnedAccount(req.user!.id, req.params.id);
    const transactions = await listAccountTransactions(
      req.user!.id,
      req.params.id,
      200,
    );

    const totalCredits = transactions
      .filter((t) => t.direction === "credit")
      .reduce((sum, t) => sum + t.amountCents, 0);
    const totalDebits = transactions
      .filter((t) => t.direction === "debit")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const closing = account.balanceCents;
    const opening = closing - (totalCredits - totalDebits);

    ok(res, {
      statement: {
        account: serializeAccount(account),
        openingBalanceCents: opening,
        closingBalanceCents: closing,
        totalCreditsCents: totalCredits,
        totalDebitsCents: totalDebits,
        transactionCount: transactions.length,
        transactions: transactions.map(serializeTransaction),
        generatedAt: new Date(),
      },
    });
  }),
);
