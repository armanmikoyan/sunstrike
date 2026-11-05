"use client";

import { useState } from "react";
import { Switch } from "@/ui/switch";
import { settingsCopy } from "./constants";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsPreferencesPane() {
  const copy = settingsCopy.preferences;
  const [autoplay, setAutoplay] = useState(true);
  const [motion, setMotion] = useState(false);
  const [autoClean, setAutoClean] = useState(true);

  const switches = [
    { ...copy.switches[0], value: autoplay, onChange: setAutoplay },
    { ...copy.switches[1], value: motion, onChange: setMotion },
    { ...copy.switches[2], value: autoClean, onChange: setAutoClean },
  ];

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={copy.defaultVideoModel}>
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              {copy.videoModel}
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                {copy.videoMeta}
              </span>
            </div>
          </SettingsField>
          <SettingsField label={copy.defaultImageModel}>
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              {copy.imageModel}
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                {copy.imageMeta}
              </span>
            </div>
          </SettingsField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={copy.defaultAspect}>
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              {copy.aspectValue}
              <span className="h-[0.5625rem] w-4 rounded-[0.125rem] border border-muted-foreground/60" />
            </div>
          </SettingsField>
          <SettingsField label={copy.defaultResolution}>
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem]">
              {copy.resolutionValue}
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                {copy.fpsValue}
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
