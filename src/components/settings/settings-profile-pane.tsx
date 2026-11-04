import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsField } from "./settings-field";
import { SettingsSaveButton } from "./settings-save-button";

export function SettingsProfilePane() {
  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">Profile</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          How you appear across the studio and the community feed.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-[1rem] font-medium text-foreground ring-1 ring-white/10">
            AM
          </span>
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-lg border-white/10 bg-white/[0.02] text-[0.6875rem] hover:bg-white/[0.05]"
              >
                Upload photo
              </Button>
              <button
                type="button"
                className="text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                Remove
              </button>
            </div>
            <p className="mt-1.5 text-[0.6875rem] text-muted-foreground">
              JPG or PNG. 2 MB max.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Display name">
            <Input
              defaultValue="Arman Mikoyan"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
            />
          </SettingsField>
          <SettingsField label="Username">
            <Input
              defaultValue="arman"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[0.6875rem]"
            />
          </SettingsField>
        </div>

        <SettingsField
          label="Email"
          hint="Used for render notifications and receipts."
        >
          <Input
            type="email"
            defaultValue="arman@chronolab.ai"
            className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
          />
        </SettingsField>

        <SettingsField label="Bio">
          <Textarea
            defaultValue="Director and motion designer. Building a small studio for image, film and everything in between."
            className="mt-1.5 min-h-[4.625rem] resize-none rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.75rem] leading-relaxed"
          />
        </SettingsField>

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Location">
            <Input
              defaultValue="Yerevan, Armenia"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
            />
          </SettingsField>
          <SettingsField label="Website">
            <Input
              defaultValue="chronolab.ai"
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
