import { Bell } from "lucide-react";
import { notificationTypeLabels } from "@/lib/notifications";
import { notifications } from "@/mocks/notifications";
import { cn } from "@/lib/utils";
import { settingsCopy } from "./constants";

export function SettingsNotificationsPane() {
  const copy = settingsCopy.notifications;
  const formatter = new Intl.DateTimeFormat(settingsCopy.account.dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="p-5">
        {notifications.length === 0 ? (
          <p className="text-[0.6875rem] text-muted-foreground">{copy.empty}</p>
        ) : (
          <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05]",
                    notification.readAt
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  <Bell className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] font-medium">
                    {notificationTypeLabels[notification.type] ??
                      notification.type}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.6875rem] text-muted-foreground">
                    {notification.generationId}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {formatter.format(new Date(notification.createdAt))}
                  </p>
                </div>
                <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
                  {notification.readAt ? copy.read : copy.unread}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
