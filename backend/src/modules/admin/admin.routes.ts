import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { created, ok } from "../../lib/response";
import { authenticate, authorize } from "../../middleware/auth";
import { getClientIp } from "../../lib/request";
import {
  ASSIGNABLE_ROLES,
  createUser,
  getStats,
  listAuditLogs,
  listUsers,
  serializeAdminUser,
  serializeAuditLog,
  setUserStatus,
  updateUser,
} from "./admin.service";

const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(120),
  password: z.string().min(8).max(128),
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]),
});

const updateUserSchema = z.object({
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  twoFactorEnabled: z.boolean().optional(),
});

const auditQuery = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

export const adminRouter = Router();

adminRouter.use(authenticate, authorize("administrator"));

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    ok(res, { stats: await getStats() });
  }),
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await listUsers();
    ok(res, { users: users.map(serializeAdminUser) });
  }),
);

adminRouter.post(
  "/users",
  asyncHandler(async (req, res) => {
    const input = createUserSchema.parse(req.body);
    const user = await createUser(input);
    created(res, { user: serializeAdminUser(user) });
  }),
);

adminRouter.patch(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const input = updateUserSchema.parse(req.body);
    const user = await updateUser(req.params.id, input);
    ok(res, { user: serializeAdminUser(user) });
  }),
);

adminRouter.post(
  "/users/:id/suspend",
  asyncHandler(async (req, res) => {
    const user = await setUserStatus(
      req.user!.id,
      req.params.id,
      "suspended",
      getClientIp(req),
    );
    ok(res, { user: serializeAdminUser(user) });
  }),
);

adminRouter.post(
  "/users/:id/reactivate",
  asyncHandler(async (req, res) => {
    const user = await setUserStatus(
      req.user!.id,
      req.params.id,
      "active",
      getClientIp(req),
    );
    ok(res, { user: serializeAdminUser(user) });
  }),
);

adminRouter.get(
  "/audit-logs",
  asyncHandler(async (req, res) => {
    const { limit } = auditQuery.parse(req.query);
    const logs = await listAuditLogs(limit);
    ok(res, { logs: logs.map(serializeAuditLog) });
  }),
);
