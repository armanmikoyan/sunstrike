import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { settingsCopy } from "./constants";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsProfilePane() {
  const copy = settingsCopy.profile;

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-[1rem] font-medium text-foreground ring-1 ring-white/10">
            {copy.initials}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-lg border-white/10 bg-white/[0.02] text-[0.6875rem] hover:bg-white/[0.05]"
              >
                {copy.uploadPhoto}
              </Button>
              <button
                type="button"
                className="text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {copy.remove}
              </button>
            </div>
            <p className="mt-1.5 text-[0.6875rem] text-muted-foreground">
              {copy.photoHint}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={copy.displayName}>
            <Input
              defaultValue={copy.displayNameValue}
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
            />
          </SettingsField>
          <SettingsField label={copy.username}>
            <Input
              defaultValue={copy.usernameValue}
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[0.6875rem]"
            />
          </SettingsField>
        </div>

        <SettingsField label={copy.email} hint={copy.emailHint}>
          <Input
            type="email"
            defaultValue={copy.emailValue}
            className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
          />
        </SettingsField>

        <SettingsField label={copy.bio}>
          <Textarea
            defaultValue={copy.bioValue}
            className="mt-1.5 min-h-[4.625rem] resize-none rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.75rem] leading-relaxed"
          />
        </SettingsField>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label={copy.location}>
            <Input
              defaultValue={copy.locationValue}
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
            />
          </SettingsField>
          <SettingsField label={copy.website}>
            <Input
              defaultValue={copy.websiteValue}
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[0.6875rem]"
            />
          </SettingsField>
        </div>

        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SettingsSaveButton />
        </div>
      </div>
    </div>
  );
}
