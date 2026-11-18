import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { SETTINGS_COPY } from "./constants";
import { SettingsNav } from "./settings-nav";
import type { ReactNode } from "react";

export function Settings({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <PageHeader eyebrow={SETTINGS_COPY.eyebrow} title={SETTINGS_COPY.title} description={SETTINGS_COPY.description} />
      <div className="mt-5 grid gap-4 lg:grid-cols-[9.75rem_1fr]">
        <SettingsNav />
        <div className="min-w-0 overflow-hidden rounded-xl border border-white/8 bg-white/1.5">{children}</div>
      </div>
    </PageShell>
  );
}
