"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedHeight } from "@/components/animated-height";
import { contentFade, instantTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { settingsNav } from "./constants";
import { SettingsAccountPane } from "./settings-account-pane";
import { SettingsNotificationsPane } from "./settings-notifications-pane";
import type { SettingsTab } from "./types";

const panes: Record<SettingsTab, () => React.JSX.Element> = {
  account: SettingsAccountPane,
  notifications: SettingsNotificationsPane,
};

export function SettingsView() {
  const [tab, setTab] = useState<SettingsTab>("account");
  const reduceMotion = useReducedMotion();
  const Pane = panes[tab];

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[13.125rem_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {settingsNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:bg-white/[0.035] hover:text-foreground",
                tab === item.key && "bg-white/[0.055] text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-3.5",
                  tab === item.key && "text-foreground",
                )}
                strokeWidth={1.8}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <AnimatedHeight>
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015]">
          <motion.div
            key={tab}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? instantTransition : contentFade}
          >
            <Pane />
          </motion.div>
        </div>
      </AnimatedHeight>
    </div>
  );
}
