import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok, created } from "../../lib/response";
import { getClientIp } from "../../lib/request";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middleware/auth";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  verifyTwoFactorSchema,
} from "./auth.schemas";
import {
  login,
  logout,
  refreshSession,
  registerUser,
  serializeUser,
  verifyTwoFactor,
} from "./auth.service";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);
    created(res, { user: serializeUser(user) });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const result = await login(input);

    if (result.requiresTwoFactor) {
      ok(res, {
        requiresTwoFactor: true,
        challengeId: result.challengeId,
        ...(result.devCode ? { devCode: result.devCode } : {}),
      });
      return;
    }

    ok(res, {
      requiresTwoFactor: false,
      user: serializeUser(result.user),
      ...result.tokens,
    });
  }),
);

authRouter.post(
  "/login/verify",
  asyncHandler(async (req, res) => {
    const input = verifyTwoFactorSchema.parse(req.body);
    const { user, tokens } = await verifyTwoFactor(input);
    ok(res, { user: serializeUser(user), ...tokens });
  }),
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const { user, tokens } = await refreshSession(refreshToken);
    ok(res, { user: serializeUser(user), ...tokens });
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    await logout(refreshToken);
    ok(res, { success: true });
  }),
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    ok(res, { user: user ? serializeUser(user) : null, ip: getClientIp(req) });
  }),
);
