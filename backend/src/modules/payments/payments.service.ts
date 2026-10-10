import type { Recipient, Transfer } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { badRequest, notFound } from "../../lib/errors";
import { toCents, fromCents } from "../../lib/money";
import { recordAudit } from "../../lib/audit";
import { LIMITS } from "../../config/limits";
import { getRecipientForUser } from "../recipients/recipients.service";
import type { CreatePaymentInput } from "./payments.schemas";

type TransferWithRecipient = Transfer & { recipient?: Recipient | null };

export function serializeTransfer(transfer: TransferWithRecipient) {
  return {
    id: transfer.id,
    reference: transfer.reference,
    amountCents: transfer.amountCents,
    amount: fromCents(transfer.amountCents),
    fromAccountId: transfer.fromAccountId,
    recipient: transfer.recipient
      ? {
          id: transfer.recipient.id,
          name: transfer.recipient.name,
          bank: transfer.recipient.bank,
          accountNumber: transfer.recipient.accountNumber,
        }
      : undefined,
    status: transfer.status,
    paymentDate: transfer.paymentDate,
    createdById: transfer.createdById,
    authorisedById: transfer.authorisedById,
    createdAt: transfer.createdAt,
  };
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export interface CreatePaymentResult {
  transfer: TransferWithRecipient;
  requiresAuthorisation: boolean;
  scheduled: boolean;
  idempotentReplay: boolean;
}

export async function createPayment(params: {
  userId: string;
  ipAddress: string;
  input: CreatePaymentInput;
}): Promise<CreatePaymentResult> {
  const { userId, ipAddress, input } = params;
  const amountCents = toCents(input.amount);

  if (amountCents <= 0) {
    throw badRequest("Amount must be greater than zero");
  }
  if (amountCents > LIMITS.perTransactionCents) {
    throw badRequest("Amount exceeds the per-transaction limit");
  }

  if (input.idempotencyKey) {
    const existing = await prisma.transfer.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      include: { recipient: true },
    });
    if (existing) {
      return {
        transfer: existing,
        requiresAuthorisation: existing.status === "pending_authorisation",
        scheduled: existing.status === "scheduled",
        idempotentReplay: true,
      };
    }
  }

  const account = await prisma.account.findFirst({
    where: { id: input.fromAccountId, userId },
  });
  if (!account) throw notFound("Source account not found");

  const recipient = await getRecipientForUser(userId, input.recipientId);

  const dailyUsage = await prisma.transfer.aggregate({
    _sum: { amountCents: true },
    where: {
      fromAccountId: account.id,
      createdById: userId,
      status: { in: ["completed", "scheduled", "pending_authorisation"] },
      createdAt: { gte: startOfToday() },
    },
  });
  const usedToday = dailyUsage._sum.amountCents ?? 0;
  if (usedToday + amountCents > LIMITS.dailyCents) {
    throw badRequest("This payment would exceed your daily limit");
  }

  const paymentDate = input.paymentDate ? new Date(input.paymentDate) : new Date();
  if (Number.isNaN(paymentDate.getTime())) {
    throw badRequest("Invalid payment date");
  }

  const requiresAuthorisation =
    amountCents > LIMITS.dualAuthorisationThresholdCents;
  const isFuture =
    paymentDate.getTime() > Date.now() + 60_000;

  if (requiresAuthorisation) {
    const transfer = await prisma.$transaction(async (tx) => {
      const created = await tx.transfer.create({
        data: {
          reference: input.reference,
          amountCents,
          fromAccountId: account.id,
          recipientId: recipient.id,
          status: "pending_authorisation",
          paymentDate,
          createdById: userId,
          idempotencyKey: input.idempotencyKey ?? null,
        },
        include: { recipient: true },
      });

      await tx.approval.create({
        data: {
          type: "payment",
          title: `Payment to ${recipient.name}`,
          amountCents,
          payloadJson: JSON.stringify({
            transferId: created.id,
            fromAccountId: account.id,
            recipientId: recipient.id,
          }),
          status: "pending",
          transferId: created.id,
          submittedById: userId,
        },
      });

      await tx.notification.create({
        data: {
          userId,
          title: "Payment awaiting authorisation",
          body: `A payment of R${fromCents(amountCents).toFixed(
            2,
          )} requires a second authoriser.`,
          severity: "info",
        },
      });

      return created;
    });

    await recordAudit({
      actorId: userId,
      action: "payment.created.pending_authorisation",
      entity: "Transfer",
      entityId: transfer.id,
      metadata: { amountCents, recipientId: recipient.id },
      ipAddress,
    });

    return {
      transfer,
      requiresAuthorisation: true,
      scheduled: false,
      idempotentReplay: false,
    };
  }

  if (isFuture) {
    const transfer = await prisma.transfer.create({
      data: {
        reference: input.reference,
        amountCents,
        fromAccountId: account.id,
        recipientId: recipient.id,
        status: "scheduled",
        paymentDate,
        createdById: userId,
        idempotencyKey: input.idempotencyKey ?? null,
      },
      include: { recipient: true },
    });

    await recordAudit({
      actorId: userId,
      action: "payment.scheduled",
      entity: "Transfer",
      entityId: transfer.id,
      metadata: { amountCents, paymentDate },
      ipAddress,
    });

    return {
      transfer,
      requiresAuthorisation: false,
      scheduled: true,
      idempotentReplay: false,
    };
  }

  if (account.availableCents < amountCents) {
    throw badRequest("Insufficient available balance");
  }

  const transfer = await prisma.$transaction(async (tx) => {
    const created = await tx.transfer.create({
      data: {
        reference: input.reference,
        amountCents,
        fromAccountId: account.id,
        recipientId: recipient.id,
        status: "completed",
        paymentDate,
        createdById: userId,
        idempotencyKey: input.idempotencyKey ?? null,
      },
      include: { recipient: true },
    });

    await tx.account.update({
      where: { id: account.id },
      data: {
        balanceCents: { decrement: amountCents },
        availableCents: { decrement: amountCents },
      },
    });

    await tx.transaction.create({
      data: {
        accountId: account.id,
        description: `Payment to ${recipient.name}`,
        category: "Transfer",
        direction: "debit",
        amountCents,
        status: "posted",
        balanceAfterCents: account.balanceCents - amountCents,
        actorId: userId,
        ipAddress,
      },
    });

    await tx.notification.create({
      data: {
        userId,
        title: "Payment sent",
        body: `R${fromCents(amountCents).toFixed(2)} paid to ${recipient.name}.`,
        severity: "info",
      },
    });

    return created;
  });

  await recordAudit({
    actorId: userId,
    action: "payment.completed",
    entity: "Transfer",
    entityId: transfer.id,
    metadata: { amountCents, recipientId: recipient.id },
    ipAddress,
  });

  return {
    transfer,
    requiresAuthorisation: false,
    scheduled: false,
    idempotentReplay: false,
  };
}

export async function listPayments(
  userId: string,
): Promise<TransferWithRecipient[]> {
  return prisma.transfer.findMany({
    where: { createdById: userId },
    include: { recipient: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getPayment(
  userId: string,
  transferId: string,
): Promise<TransferWithRecipient> {
  const transfer = await prisma.transfer.findFirst({
    where: {
      id: transferId,
      OR: [{ createdById: userId }, { authorisedById: userId }],
    },
    include: { recipient: true },
  });
  if (!transfer) throw notFound("Payment not found");
  return transfer;
}
