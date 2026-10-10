import { createHash } from "node:crypto";
import type { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  conflict,
  forbidden,
  tooManyRequests,
  unauthorized,
} from "../../lib/errors";
import { hashPassword, verifyPassword } from "../../lib/password";
import { signAccessToken } from "../../lib/jwt";
import { env, isProduction } from "../../config/env";
import { generateOtp } from "../../lib/ids";
import { recordAudit } from "../../lib/audit";
import {
  consumeRefreshToken,
  createRefreshToken,
  revokeRefreshToken,
} from "../../lib/tokens";
import type { LoginInput, RegisterInput } from "./auth.schemas";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
const OTP_TTL_MINUTES = 5;

const hashOtp = (code: string) =>
  createHash("sha256").update(code).digest("hex");

export interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export function serializeUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
  };
}

async function issueTokens(user: User): Promise<TokenBundle> {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = await createRefreshToken(user.id);
  return {
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: env.ACCESS_TOKEN_TTL,
  };
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw conflict("An account with that email already exists");
  }

  const user = await prisma.user.create({
    data: {
      email,
      fullName: input.fullName.trim(),
      passwordHash: await hashPassword(input.password),
      role: "capturer",
    },
  });

  await recordAudit({
    actorId: user.id,
    action: "user.register",
    entity: "User",
    entityId: user.id,
    metadata: { email },
  });

  return user;
}

export type LoginResult =
  | { requiresTwoFactor: true; challengeId: string; devCode?: string }
  | { requiresTwoFactor: false; user: User; tokens: TokenBundle };

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw unauthorized("Invalid email or password");
  }
  if (user.status !== "active") {
    throw forbidden("This account has been suspended. Contact support.");
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw tooManyRequests(
      "Too many failed attempts. Please try again in a few minutes.",
    );
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    const failed = user.failedLoginCount + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: failed,
        lockedUntil:
          failed >= MAX_FAILED_LOGINS
            ? new Date(Date.now() + LOCK_MINUTES * 60_000)
            : null,
      },
    });
    throw unauthorized("Invalid email or password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });

  if (user.twoFactorEnabled && env.TWO_FACTOR_ENABLED) {
    const code = generateOtp();
    const challenge = await prisma.loginChallenge.create({
      data: {
        userId: user.id,
        codeHash: hashOtp(code),
        expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
      },
    });

    await recordAudit({
      actorId: user.id,
      action: "auth.2fa.challenge",
      entity: "User",
      entityId: user.id,
    });

    console.info(`[2FA] Login code for ${user.email}: ${code}`);

    return {
      requiresTwoFactor: true,
      challengeId: challenge.id,
      ...(isProduction ? {} : { devCode: code }),
    };
  }

  const tokens = await issueTokens(user);
  await recordAudit({
    actorId: user.id,
    action: "auth.login",
    entity: "User",
    entityId: user.id,
  });
  return { requiresTwoFactor: false, user, tokens };
}

export async function verifyTwoFactor(input: {
  challengeId: string;
  code: string;
}): Promise<{ user: User; tokens: TokenBundle }> {
  const challenge = await prisma.loginChallenge.findUnique({
    where: { id: input.challengeId },
    include: { user: true },
  });

  if (
    !challenge ||
    challenge.consumedAt ||
    challenge.expiresAt < new Date() ||
    challenge.codeHash !== hashOtp(input.code)
  ) {
    throw unauthorized("That verification code is incorrect or expired");
  }

  await prisma.loginChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  const tokens = await issueTokens(challenge.user);
  await recordAudit({
    actorId: challenge.user.id,
    action: "auth.login.2fa",
    entity: "User",
    entityId: challenge.user.id,
  });

  return { user: challenge.user, tokens };
}

export async function refreshSession(
  refreshToken: string,
): Promise<{ user: User; tokens: TokenBundle }> {
  const record = await consumeRefreshToken(refreshToken);
  if (!record) {
    throw unauthorized("Your session has expired. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user || user.status !== "active") {
    throw unauthorized("Your session is no longer valid");
  }

  const tokens = await issueTokens(user);
  return { user, tokens };
}

export async function logout(refreshToken: string): Promise<void> {
  await revokeRefreshToken(refreshToken);
}
