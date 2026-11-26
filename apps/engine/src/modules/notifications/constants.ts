export const NOTIFICATION_TYPES = ["generation_succeeded", "generation_failed"] as const;

export const NOTIFICATION_ERRORS = {
  notFound: "Notification not found.",
  invalidBody: "Send { read: true } to mark a notification read.",
} as const;
