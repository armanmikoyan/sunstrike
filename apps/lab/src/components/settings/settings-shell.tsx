import { PageHeader } from "@/components/page-header";
import { settingsCopy } from "./constants";
import { SettingsNav } from "./settings-nav";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader eyebrow={settingsCopy.eyebrow} title={settingsCopy.title} description={settingsCopy.description} />
      <div className="mt-5 grid gap-4 lg:grid-cols-[9.75rem_1fr]">
        <SettingsNav />
        <div className="min-w-0 overflow-hidden rounded-xl border border-white/8 bg-white/1.5">{children}</div>
      </div>
    </div>
  );
}
