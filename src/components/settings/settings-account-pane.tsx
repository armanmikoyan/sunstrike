import { Input } from "@/ui/input";
import { currentUser, settingsCopy } from "./constants";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsAccountPane() {
  const copy = settingsCopy.account;
  const created = new Intl.DateTimeFormat(copy.dateLocale, {
    dateStyle: "medium",
  }).format(new Date(currentUser.createdAt));

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="space-y-5 p-5">
        <SettingsField label={copy.email} hint={copy.emailHint}>
          <Input
            id="account-email"
            type="email"
            defaultValue={currentUser.email}
            className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.015] text-[0.6875rem]"
          />
        </SettingsField>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={copy.userId}>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-white/[0.08] bg-white/[0.015] px-3 font-mono text-[0.6875rem] text-muted-foreground">
              {currentUser.id}
            </div>
          </SettingsField>
          <SettingsField label={copy.createdAt}>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-white/[0.08] bg-white/[0.015] px-3 text-[0.6875rem] text-muted-foreground">
              {created}
            </div>
          </SettingsField>
        </div>

        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SettingsSaveButton />
        </div>
      </div>
    </div>
  );
}
