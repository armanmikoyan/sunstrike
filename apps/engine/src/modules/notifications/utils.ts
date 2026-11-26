import type { GenerationFinished } from "@/modules/generations";
import type { ParseResult } from "@/shared/types";
import { isRecord, parseFailure, toIsoString } from "@/shared/utils";
import { NOTIFICATION_ERRORS } from "./constants";
import type { NewNotification, Notification, NotificationRow, NotificationView } from "./types";

export function toNewNotification(event: GenerationFinished): NewNotification {
  return {
    userId: event.userId,
    generationId: event.generationId,
    type: event.status === "succeeded" ? "generation_succeeded" : "generation_failed",
  };
}

/** The only change a client may make is `{ read: true }`. */
export function parseReadBody(body: unknown): ParseResult<true> {
  return isRecord(body) && body.read === true
    ? { ok: true, value: true }
    : parseFailure(NOTIFICATION_ERRORS.invalidBody);
}

export function mapNotificationRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    generationId: row.generation_id,
    type: row.type,
    readAt: row.read_at === null ? null : toIsoString(row.read_at),
    createdAt: toIsoString(row.created_at),
  };
}

export function toNotificationView(notification: Notification): NotificationView {
  return {
    id: notification.id,
    generationId: notification.generationId,
    type: notification.type,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
}
