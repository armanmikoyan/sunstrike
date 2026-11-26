import { type GenerationFinished, generations } from "@/modules/generations";
import type { PageQuery } from "@/shared/types";
import { notFound, toPage } from "@/shared/utils";
import { NOTIFICATION_ERRORS } from "./constants";
import * as repository from "./repository";
import type { NotificationPage, NotificationView } from "./types";
import { toNewNotification, toNotificationView } from "./utils";

export async function record(event: GenerationFinished): Promise<void> {
  await repository.insert(toNewNotification(event));
}

/** Record a notification for every finished generation; returns a function that stops listening. */
export function listen(): () => void {
  return generations.onFinished(record);
}

export async function listNotifications(userId: string, query: PageQuery): Promise<NotificationPage> {
  const page = toPage(await repository.listForUser(userId, query.limit + 1, query.cursor), query.limit);

  return { notifications: page.items.map(toNotificationView), nextCursor: page.nextCursor };
}

export async function markRead(userId: string, notificationId: string): Promise<NotificationView> {
  const notification = await repository.markRead(userId, notificationId);

  if (!notification) throw notFound(NOTIFICATION_ERRORS.notFound);

  return toNotificationView(notification);
}
