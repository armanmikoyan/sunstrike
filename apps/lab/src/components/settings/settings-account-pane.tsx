import { Input } from "@/ui/input";
import { CURRENT_USER, SETTINGS_COPY } from "./constants";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsAccountPane() {
  const created = new Intl.DateTimeFormat(SETTINGS_COPY.account.dateLocale, {
    dateStyle: "medium",
  }).format(new Date(CURRENT_USER.createdAt));

  return (
    <div>
      <div className="border-b border-white/6 px-5 py-4">
        <h2 className="text-sm lg:text-xs font-medium">{SETTINGS_COPY.account.title}</h2>
        <p className="mt-0.5 text-muted-foreground">{SETTINGS_COPY.account.description}</p>
      </div>
      <div className="space-y-5 p-5">
        <SettingsField
          label={SETTINGS_COPY.account.email}
          hint={SETTINGS_COPY.account.emailHint}
          htmlFor="account-email"
        >
          <Input
            id="account-email"
            type="email"
            defaultValue={CURRENT_USER.email}
            className="mt-1.5 h-9 rounded-lg border-white/8 bg-white/1.5"
          />
        </SettingsField>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={SETTINGS_COPY.account.userId}>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-white/8 bg-white/1.5 px-3 font-mono text-muted-foreground">
              {CURRENT_USER.id}
            </div>
          </SettingsField>
          <SettingsField label={SETTINGS_COPY.account.createdAt}>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-white/8 bg-white/1.5 px-3 text-muted-foreground">
              {created}
            </div>
          </SettingsField>
        </div>

        <div className="flex justify-end border-t border-white/6 pt-4">
          <SettingsSaveButton />
        </div>
      </div>
    </div>
  );
}
