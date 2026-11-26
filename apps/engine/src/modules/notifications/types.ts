import type { NOTIFICATION_TYPES } from "./constants";

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  userId: string;
  generationId: string;
  type: NotificationType;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  generation_id: string;
  type: NotificationType;
  read_at: Date | string | null;
  created_at: Date | string;
}

export type NewNotification = Pick<Notification, "userId" | "generationId" | "type">;

export interface NotificationView {
  id: string;
  generationId: string;
  type: NotificationType;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  notifications: NotificationView[];
  nextCursor: string | null;
}
