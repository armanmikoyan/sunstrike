import { query } from "@/infra/database";
import type { NewNotification, Notification, NotificationRow } from "./types";
import { mapNotificationRow } from "./utils";

const columns = `
  id,
  user_id,
  generation_id,
  type,
  read_at,
  created_at
`;

/** Record a notification once per generation and type; a repeat is ignored. */
export async function insert(notification: NewNotification): Promise<void> {
  await query(
    `insert into notifications (user_id, generation_id, type)
     values ($1, $2, $3)
     on conflict (generation_id, type) do nothing`,
    [notification.userId, notification.generationId, notification.type],
  );
}

/** A user's notifications, newest first, starting after the notification a previous page ended on. */
export async function listForUser(userId: string, limit: number, afterId: string | null): Promise<Notification[]> {
  const rows = await query<NotificationRow>(
    `select ${columns}
     from notifications
     where user_id = $1
       and (
         $3::uuid is null
         or (created_at, id) < (
           select previous.created_at, previous.id
           from notifications as previous
           where previous.id = $3 and previous.user_id = $1
         )
       )
     order by created_at desc, id desc
     limit $2`,
    [userId, limit, afterId],
  );

  return rows.map(mapNotificationRow);
}

/** Mark one of the user's notifications read, keeping the first read time; null when it is not theirs. */
export async function markRead(userId: string, id: string): Promise<Notification | null> {
  const rows = await query<NotificationRow>(
    `update notifications
     set read_at = coalesce(read_at, now())
     where user_id = $1 and id = $2
     returning ${columns}`,
    [userId, id],
  );

  return rows[0] ? mapNotificationRow(rows[0]) : null;
}
