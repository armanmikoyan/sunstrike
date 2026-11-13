import { describe, expect, it } from "vitest";
import { notifications, unreadNotifications } from "./notifications";
import { notificationTypeLabels } from "@/lib/notifications";

describe("notifications", () => {
  it("ties every notification to a generation", () => {
    for (const notification of notifications) {
      expect(notification.generationId.length).toBeGreaterThan(0);
      expect(notification.createdAt.length).toBeGreaterThan(0);
    }
  });

  it("uses a label for every type in the data", () => {
    for (const notification of notifications) {
      expect(notificationTypeLabels[notification.type]).toBeDefined();
    }
  });

  it("counts rows with no read_at as unread", () => {
    const expected = notifications.filter(
      (notification) => notification.readAt === null,
    );
    expect(unreadNotifications).toHaveLength(expected.length);
    expect(unreadNotifications.length).toBeGreaterThan(0);
  });
});
