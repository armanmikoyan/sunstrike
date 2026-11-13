import type { Notification } from "@/lib/design";

/**
 * Notifications from 02 Core entities. Every row points at the generation that
 * caused it; `read_at` is null until the user opens it.
 */
export const notifications: Notification[] = [
  {
    id: "ntf_20931",
    generationId: "gen_20931",
    type: "generation_succeeded",
    readAt: null,
    createdAt: "2026-11-13T14:32:00.000Z",
  },
  {
    id: "ntf_20928",
    generationId: "gen_20928",
    type: "generation_succeeded",
    readAt: "2026-11-13T14:20:00.000Z",
    createdAt: "2026-11-13T14:08:00.000Z",
  },
  {
    id: "ntf_20927",
    generationId: "gen_20927",
    type: "generation_failed",
    readAt: "2026-11-13T13:10:00.000Z",
    createdAt: "2026-11-13T13:03:00.000Z",
  },
];

export const unreadNotifications = notifications.filter(
  (notification) => notification.readAt === null,
);

