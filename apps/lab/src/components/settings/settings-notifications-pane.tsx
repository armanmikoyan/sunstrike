import { Bell } from "lucide-react";
import { NOTIFICATION_TYPE_LABELS } from "@/components/nav/constants";
import { notifications } from "@/mocks/notifications";
import { cn } from "cn";
import { SETTINGS_COPY } from "./constants";

export function SettingsNotificationsPane() {
  const formatter = new Intl.DateTimeFormat(SETTINGS_COPY.account.dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div>
      <div className="border-b border-white/6 px-5 py-4">
        <h2 className="text-sm lg:text-xs font-medium">{SETTINGS_COPY.notifications.title}</h2>
        <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
          {SETTINGS_COPY.notifications.description}
        </p>
      </div>
      <div className="p-5">
        {notifications.length === 0 ? (
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{SETTINGS_COPY.notifications.empty}</p>
        ) : (
          <div className="divide-y divide-white/6 rounded-xl border border-white/7">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 px-4 py-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/5",
                    notification.readAt ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  <Bell className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-[0.6875rem] font-medium">
                    {NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}
                  </p>
                  <p className="mt-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">
                    {notification.generationId}
                  </p>
                  <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
                    {formatter.format(new Date(notification.createdAt))}
                  </p>
                </div>
                <span className="shrink-0 text-xs lg:text-[0.6875rem] text-muted-foreground">
                  {notification.readAt ? SETTINGS_COPY.notifications.read : SETTINGS_COPY.notifications.unread}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
