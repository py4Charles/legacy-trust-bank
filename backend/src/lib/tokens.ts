import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./prisma";
import { env } from "../config/env";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function ttlToMs(ttl: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(ttl.trim());
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;
  return value * units[match[2] as keyof typeof units];
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + ttlToMs(env.REFRESH_TOKEN_TTL));

  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });

  return token;
}

export async function consumeRefreshToken(token: string) {
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  return record;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
