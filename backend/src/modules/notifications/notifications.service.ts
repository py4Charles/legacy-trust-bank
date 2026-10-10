import type { Notification } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";

export function serializeNotification(notification: Notification) {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    severity: notification.severity,
    read: notification.read,
    createdAt: notification.createdAt,
  };
}

export async function listNotifications(
  userId: string,
): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationRead(
  userId: string,
  id: string,
): Promise<Notification> {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) throw notFound("Notification not found");

  return prisma.notification.update({
    where: { id: notification.id },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return result.count;
}
