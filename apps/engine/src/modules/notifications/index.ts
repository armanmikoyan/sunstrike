import * as service from "./service";

/** In-app notices about the user's generations. */
export const notifications = {
  listen: service.listen,
};

export type { NotificationType, NotificationView } from "./types";
