import type { Recipient } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";

export function serializeRecipient(recipient: Recipient) {
  return {
    id: recipient.id,
    name: recipient.name,
    bank: recipient.bank,
    accountNumber: recipient.accountNumber,
    reference: recipient.reference,
    favourite: recipient.favourite,
  };
}

export async function listRecipients(userId: string): Promise<Recipient[]> {
  return prisma.recipient.findMany({
    where: { OR: [{ ownerId: userId }, { ownerId: null }] },
    orderBy: [{ favourite: "desc" }, { name: "asc" }],
  });
}

export async function getRecipientForUser(
  userId: string,
  recipientId: string,
): Promise<Recipient> {
  const recipient = await prisma.recipient.findFirst({
    where: {
      id: recipientId,
      OR: [{ ownerId: userId }, { ownerId: null }],
    },
  });
  if (!recipient) throw notFound("Recipient not found");
  return recipient;
}

export async function createRecipient(
  userId: string,
  input: {
    name: string;
    bank: string;
    accountNumber: string;
    reference?: string;
    favourite?: boolean;
  },
): Promise<Recipient> {
  return prisma.recipient.create({
    data: {
      ownerId: userId,
      name: input.name,
      bank: input.bank,
      accountNumber: input.accountNumber,
      reference: input.reference ?? null,
      favourite: input.favourite ?? false,
    },
  });
}

export async function deleteRecipient(
  userId: string,
  recipientId: string,
): Promise<void> {
  const recipient = await prisma.recipient.findFirst({
    where: { id: recipientId, ownerId: userId },
  });
  if (!recipient) throw notFound("Recipient not found");
  await prisma.recipient.delete({ where: { id: recipient.id } });
}
