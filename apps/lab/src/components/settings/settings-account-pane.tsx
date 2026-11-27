import { PaneHeader } from "@/components/pane-header";
import { Input } from "@/ui/input";
import { currentUser } from "@/mocks/user";
import { SETTINGS_COPY } from "./constants";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsAccountPane() {
  const created = new Intl.DateTimeFormat(SETTINGS_COPY.account.dateLocale, {
    dateStyle: "medium",
  }).format(new Date(currentUser.createdAt));

  return (
    <div>
      <PaneHeader title={SETTINGS_COPY.account.title} description={SETTINGS_COPY.account.description} />
      <div className="space-y-4 p-5">
        <SettingsField
          label={SETTINGS_COPY.account.email}
          hint={SETTINGS_COPY.account.emailHint}
          htmlFor="account-email"
        >
          <Input
            id="account-email"
            type="email"
            defaultValue={currentUser.email}
            className="mt-1.5 h-9 rounded-lg border-white/8 bg-white/1.5"
          />
        </SettingsField>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={SETTINGS_COPY.account.userId}>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-white/8 bg-white/1.5 px-3 font-mono text-muted-foreground">
              {currentUser.id}
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
