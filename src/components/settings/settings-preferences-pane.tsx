"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsPreferencesPane() {
  const [autoplay, setAutoplay] = useState(true);
  const [motion, setMotion] = useState(false);
  const [autoClean, setAutoClean] = useState(true);

  const switches = [
    {
      title: "Autoplay previews",
      description: "Loop community and library clips automatically.",
      value: autoplay,
      onChange: setAutoplay,
    },
    {
      title: "Reduce interface motion",
      description: "Pause the community wall and other ambient movement.",
      value: motion,
      onChange: setMotion,
    },
    {
      title: "Auto-clean failed renders",
      description: "Remove failed generations after 7 days.",
      value: autoClean,
      onChange: setAutoClean,
    },
  ];

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">Studio preferences</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          Set the defaults that open with each new generation.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Default video model">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              Chronolab Motion 2
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                $0.51 · 6s
              </span>
            </div>
          </SettingsField>
          <SettingsField label="Default image model">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              Chronolab Image 2
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                $0.07 · 1 MP
              </span>
            </div>
          </SettingsField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Default aspect ratio">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              16:9
              <span className="h-[0.5625rem] w-4 rounded-[0.125rem] border border-muted-foreground/60" />
            </div>
          </SettingsField>
          <SettingsField label="Default resolution">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              1080p
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                24 fps
              </span>
            </div>
          </SettingsField>
        </div>

        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
          {switches.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-5 px-4 py-3"
            >
              <div>
                <p className="text-[0.6875rem] font-medium">{item.title}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch checked={item.value} onCheckedChange={item.onChange} />
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
