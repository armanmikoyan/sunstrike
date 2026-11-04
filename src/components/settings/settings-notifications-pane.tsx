"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { notificationDefaults, notificationRows } from "./constants";
import { SettingsSaveButton } from "./settings-save-button";
import type { NotificationKey } from "./types";

export function SettingsNotificationsPane() {
  const [values, setValues] = useState(notificationDefaults);

  const toggle = (key: NotificationKey) => {
    setValues((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">Notifications</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          Choose what reaches your inbox.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
          {notificationRows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-5 px-4 py-3"
            >
              <div>
                <p className="text-[0.6875rem] font-medium">{row.title}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {row.description}
                </p>
              </div>
              <Switch
                checked={values[row.key]}
                onCheckedChange={() => toggle(row.key)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SettingsSaveButton />
        </div>
      </div>
    </div>
  );
}
