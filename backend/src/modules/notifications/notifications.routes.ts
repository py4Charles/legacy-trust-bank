import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok } from "../../lib/response";
import { authenticate } from "../../middleware/auth";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  serializeNotification,
} from "./notifications.service";

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await listNotifications(req.user!.id);
    ok(res, {
      notifications: notifications.map(serializeNotification),
      unread: notifications.filter((n) => !n.read).length,
    });
  }),
);

notificationsRouter.post(
  "/read-all",
  asyncHandler(async (req, res) => {
    const count = await markAllNotificationsRead(req.user!.id);
    ok(res, { success: true, updated: count });
  }),
);

notificationsRouter.post(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const notification = await markNotificationRead(
      req.user!.id,
      req.params.id,
    );
    ok(res, { notification: serializeNotification(notification) });
  }),
);
