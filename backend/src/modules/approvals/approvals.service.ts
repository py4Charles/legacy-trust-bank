import type { Approval } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { badRequest, conflict, forbidden, notFound } from "../../lib/errors";
import { fromCents } from "../../lib/money";
import { recordAudit } from "../../lib/audit";
import type { AuthUser } from "../../middleware/auth";

export function serializeApproval(approval: Approval) {
  return {
    id: approval.id,
    type: approval.type,
    title: approval.title,
    amountCents: approval.amountCents,
    amount: fromCents(approval.amountCents),
    status: approval.status,
    transferId: approval.transferId,
    submittedById: approval.submittedById,
    decidedById: approval.decidedById,
    decidedAt: approval.decidedAt,
    createdAt: approval.createdAt,
  };
}

export async function listApprovals(user: AuthUser): Promise<Approval[]> {
  const where =
    user.role === "capturer"
      ? { submittedById: user.id }
      : { status: "pending" };

  return prisma.approval.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function decideApproval(params: {
  user: AuthUser;
  approvalId: string;
  decision: "approved" | "rejected";
  ipAddress: string;
}): Promise<Approval> {
  const { user, approvalId, decision, ipAddress } = params;

  if (user.role !== "authoriser" && user.role !== "administrator") {
    throw forbidden("Only authorisers and administrators can decide approvals");
  }

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
  });
  if (!approval) throw notFound("Approval not found");
  if (approval.status !== "pending") {
    throw conflict("This item has already been decided");
  }
  if (approval.submittedById === user.id) {
    throw forbidden(
      "Dual authorisation: you cannot decide an item you submitted yourself",
    );
  }

  if (decision === "approved" && approval.type === "payment") {
    await authorisePaymentApproval({ user, approval, ipAddress });
  } else {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.approval.updateMany({
        where: { id: approval.id, status: "pending" },
        data: {
          status: decision,
          decidedById: user.id,
          decidedAt: new Date(),
        },
      });
      if (claimed.count === 0) {
        throw conflict("This item has already been decided");
      }

      if (approval.transferId) {
        await tx.transfer.updateMany({
          where: { id: approval.transferId, status: "pending_authorisation" },
          data: { status: decision === "approved" ? "scheduled" : "rejected" },
        });
      }
    });
  }

  await recordAudit({
    actorId: user.id,
    action: `approval.${decision}`,
    entity: "Approval",
    entityId: approval.id,
    metadata: { type: approval.type, transferId: approval.transferId },
    ipAddress,
  });

  const updated = await prisma.approval.findUniqueOrThrow({
    where: { id: approval.id },
  });

  await prisma.notification.create({
    data: {
      userId: approval.submittedById,
      title: `Approval ${decision}`,
      body: `"${approval.title}" was ${decision} by ${user.email}.`,
      severity: decision === "approved" ? "info" : "warning",
    },
  });

  return updated;
}

async function authorisePaymentApproval(params: {
  user: AuthUser;
  approval: Approval;
  ipAddress: string;
}): Promise<void> {
  const { user, approval, ipAddress } = params;

  const transfer = approval.transferId
    ? await prisma.transfer.findUnique({
        where: { id: approval.transferId },
        include: { recipient: true },
      })
    : null;
  if (!transfer) throw notFound("Linked transfer not found");
  if (transfer.status !== "pending_authorisation") {
    throw conflict("This transfer is no longer awaiting authorisation");
  }

  const account = await prisma.account.findUnique({
    where: { id: transfer.fromAccountId },
  });
  if (!account) throw notFound("Source account not found");

  await prisma.$transaction(async (tx) => {
    const claimed = await tx.approval.updateMany({
      where: { id: approval.id, status: "pending" },
      data: {
        status: "approved",
        decidedById: user.id,
        decidedAt: new Date(),
      },
    });
    if (claimed.count === 0) {
      throw conflict("This item has already been decided");
    }

    const settled = await tx.transfer.updateMany({
      where: { id: transfer.id, status: "pending_authorisation" },
      data: { status: "completed", authorisedById: user.id },
    });
    if (settled.count === 0) {
      throw conflict("This transfer is no longer awaiting authorisation");
    }

    const debited = await tx.account.updateMany({
      where: {
        id: account.id,
        availableCents: { gte: transfer.amountCents },
      },
      data: {
        balanceCents: { decrement: transfer.amountCents },
        availableCents: { decrement: transfer.amountCents },
      },
    });
    if (debited.count === 0) {
      throw badRequest("Insufficient available balance to authorise this payment");
    }

    const fresh = await tx.account.findUniqueOrThrow({
      where: { id: account.id },
    });

    await tx.transaction.create({
      data: {
        accountId: account.id,
        description: `Payment to ${transfer.recipient.name}`,
        category: "Transfer",
        direction: "debit",
        amountCents: transfer.amountCents,
        status: "posted",
        balanceAfterCents: fresh.balanceCents,
        actorId: user.id,
        ipAddress,
      },
    });
  });
}
