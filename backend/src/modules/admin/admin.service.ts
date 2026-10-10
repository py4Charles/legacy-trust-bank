import type { AuditLog, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { conflict, notFound } from "../../lib/errors";
import { hashPassword } from "../../lib/password";
import { recordAudit } from "../../lib/audit";

export const ASSIGNABLE_ROLES = ["capturer", "authoriser", "administrator"];

export function serializeAdminUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function listUsers(): Promise<User[]> {
  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createUser(input: {
  email: string;
  fullName: string;
  password: string;
  role: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw conflict("A user with that email already exists");

  return prisma.user.create({
    data: {
      email,
      fullName: input.fullName.trim(),
      passwordHash: await hashPassword(input.password),
      role: input.role,
    },
  });
}

export async function updateUser(
  id: string,
  input: { role?: string; status?: string; twoFactorEnabled?: boolean },
): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFound("User not found");

  return prisma.user.update({
    where: { id },
    data: {
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.twoFactorEnabled !== undefined
        ? { twoFactorEnabled: input.twoFactorEnabled }
        : {}),
    },
  });
}

export async function setUserStatus(
  actorId: string,
  id: string,
  status: "active" | "suspended",
  ipAddress: string,
): Promise<User> {
  const updated = await updateUser(id, { status });
  await recordAudit({
    actorId,
    action: `admin.user.${status}`,
    entity: "User",
    entityId: id,
    ipAddress,
  });
  return updated;
}

export async function listAuditLogs(limit = 100): Promise<AuditLog[]> {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function serializeAuditLog(log: AuditLog) {
  return {
    id: log.id,
    actorId: log.actorId,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    metadata: log.metadataJson ? JSON.parse(log.metadataJson) : null,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt,
  };
}

export async function getStats() {
  const [users, accounts, transactions, pendingApprovals, transfers] =
    await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.transaction.count(),
      prisma.approval.count({ where: { status: "pending" } }),
      prisma.transfer.count(),
    ]);

  return { users, accounts, transactions, pendingApprovals, transfers };
}
