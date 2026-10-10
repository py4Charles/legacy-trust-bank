import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok } from "../../lib/response";
import { notFound } from "../../lib/errors";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middleware/auth";
import { serializeTransaction } from "../accounts/accounts.service";

const querySchema = z.object({
  accountId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { accountId, limit } = querySchema.parse(req.query);

    const ownedIds = (
      await prisma.account.findMany({
        where: { userId: req.user!.id },
        select: { id: true },
      })
    ).map((a) => a.id);

    const where = accountId
      ? ownedIds.includes(accountId)
        ? { accountId }
        : { id: "__none__" }
      : { accountId: { in: ownedIds } };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    ok(res, { transactions: transactions.map(serializeTransaction) });
  }),
);

transactionsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownedIds = (
      await prisma.account.findMany({
        where: { userId: req.user!.id },
        select: { id: true },
      })
    ).map((a) => a.id);

    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, accountId: { in: ownedIds } },
    });

    if (!transaction) throw notFound("Transaction not found");
    ok(res, { transaction: serializeTransaction(transaction) });
  }),
);
