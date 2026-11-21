import { Settings } from "@/components/settings";
import { SettingsGate } from "@/components/settings/settings-gate";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Settings>
      <SettingsGate>{children}</SettingsGate>
    </Settings>
  );
}
