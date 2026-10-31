"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  LockKeyhole,
  Monitor,
  Plus,
  Shield,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "api", label: "API keys", icon: KeyRound },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-foreground/80">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <Button
      type="button"
      onClick={() => setSaved(true)}
      className="h-8 rounded-lg bg-brand px-3 text-[11px] font-medium text-brand-foreground hover:bg-brand-hover"
    >
      {saved ? <Check className="size-3" /> : null}
      {saved ? "Saved" : "Save changes"}
    </Button>
  );
}

function ProfilePane() {
  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[13px] font-medium">Profile</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          How you appear across the studio and the community feed.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-[16px] font-medium text-foreground ring-1 ring-white/10">
            AM
          </span>
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-lg border-white/10 bg-white/[0.02] text-[11px] hover:bg-white/[0.05]"
              >
                Upload photo
              </Button>
              <button
                type="button"
                className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Remove
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              JPG or PNG. 2 MB max.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name">
            <Input
              defaultValue="Arman Mikoyan"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[11px]"
            />
          </Field>
          <Field label="Username">
            <Input
              defaultValue="arman"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[11px]"
            />
          </Field>
        </div>

        <Field
          label="Email"
          hint="Used for render notifications and receipts."
        >
          <Input
            type="email"
            defaultValue="arman@sunstrike.ai"
            className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[11px]"
          />
        </Field>

        <Field label="Bio">
          <Textarea
            defaultValue="Director and motion designer. Building a small studio for image, film and everything in between."
            className="mt-1.5 min-h-[74px] resize-none rounded-lg border-white/[0.08] bg-white/[0.02] text-[12px] leading-relaxed"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <Input
              defaultValue="Yerevan, Armenia"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-[11px]"
            />
          </Field>
          <Field label="Website">
            <Input
              defaultValue="sunstrike.ai"
              className="mt-1.5 h-9 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[11px]"
            />
          </Field>
        </div>

        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

function PreferencesPane() {
  const [autoplay, setAutoplay] = useState(true);
  const [motion, setMotion] = useState(false);
  const [upscale, setUpscale] = useState(true);

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[13px] font-medium">Studio preferences</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Set the defaults that open with each new generation.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default video model">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[11px]">
              Sunstrike Motion 2
              <span className="font-mono text-[11px] text-muted-foreground">
                $0.51 · 6s
              </span>
            </div>
          </Field>
          <Field label="Default image model">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[11px]">
              Sunstrike Image 2
              <span className="font-mono text-[11px] text-muted-foreground">
                $0.07 · 1 MP
              </span>
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default aspect ratio">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[11px]">
              16:9
              <span className="h-[9px] w-4 rounded-[2px] border border-muted-foreground/60" />
            </div>
          </Field>
          <Field label="Default resolution">
            <div className="mt-1.5 flex h-9 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[11px]">
              1080p
              <span className="font-mono text-[11px] text-muted-foreground">
                24 fps
              </span>
            </div>
          </Field>
        </div>

        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
          {[
            {
              title: "Autoplay previews",
              description: "Loop community and library clips automatically.",
              value: autoplay,
              onChange: setAutoplay,
            },
            {
              title: "Reduce interface motion",
              description:
                "Pause the community wall and other ambient movement.",
              value: motion,
              onChange: setMotion,
            },
            {
              title: "Auto-clean failed renders",
              description: "Remove failed generations after 7 days.",
              value: upscale,
              onChange: setUpscale,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-5 px-4 py-3"
            >
              <div>
                <p className="text-[11px] font-medium">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch checked={item.value} onCheckedChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

function NotificationsPane() {
  const [values, setValues] = useState({
    rendered: true,
    credits: true,
    product: false,
    community: false,
    digest: true,
  });

  const toggle = (key: keyof typeof values) => {
    setValues((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[13px] font-medium">Notifications</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Choose what reaches your inbox.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
          {[
            [
              "rendered",
              "Render complete",
              "Let me know when a video or image is ready.",
            ],
            [
              "credits",
              "Balance and top-ups",
              "Receipts, auto top-up and low balance warnings.",
            ],
            [
              "product",
              "New models and tools",
              "Occasional notes when a new model lands.",
            ],
            [
              "community",
              "Community activity",
              "Likes, follows and replies on published work.",
            ],
            [
              "digest",
              "Weekly studio digest",
              "A short roundup of what you made and spent.",
            ],
          ].map(([key, title, description]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-5 px-4 py-3"
            >
              <div>
                <p className="text-[11px] font-medium">{title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {description}
                </p>
              </div>
              <Switch
                checked={values[key as keyof typeof values]}
                onCheckedChange={() =>
                  toggle(key as keyof typeof values)
                }
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-white/[0.06] pt-4">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

function SecurityPane() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[13px] font-medium">Security</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Sessions, keys and account protection.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="size-3.5 text-muted-foreground" />
            <p className="text-[11px] font-medium">Password</p>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Last changed 3 months ago.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-7 rounded-lg border-white/10 bg-transparent text-[11px] hover:bg-white/[0.04]"
          >
            Change password
          </Button>
        </div>

        <div className="rounded-xl border border-white/[0.07]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-[11px] font-medium">Active sessions</p>
          </div>
          {[
            {
              icon: Laptop,
              device: "MacBook Pro · Chrome",
              location: "Yerevan, Armenia",
              current: true,
            },
            {
              icon: Monitor,
              device: "iPad Pro · Safari",
              location: "Yerevan, Armenia",
              current: false,
            },
          ].map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.device}
                className="flex items-center gap-3 border-b border-white/[0.055] px-4 py-3 last:border-0"
              >
                <span className="grid size-7 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-muted-foreground">
                  <Icon className="size-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px]">{session.device}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {session.location}
                  </p>
                </div>
                {session.current ? (
                  <span className="text-[11px] text-foreground">
                    Current
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/[0.07] p-4">
          <p className="text-[11px] font-medium">API key</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Use this key for the Sunstrike API. Keep it private.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-white/[0.07] bg-black/20 px-2.5 py-2 font-mono text-[11px] text-muted-foreground">
              {showKey ? "vyr_live_4d82f1a997c34e2b" : "vyr_live_••••••••••••"}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              onClick={() => setShowKey((value) => !value)}
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              onClick={() => setCopied(true)}
              aria-label="Copy API key"
            >
              {copied ? (
                <Check className="size-3.5 text-foreground" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Created Oct 12, 2026 · never used
            </p>
            <button
              type="button"
              className="text-[11px] text-destructive hover:underline"
            >
              Revoke key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiPane() {
  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[13px] font-medium">API keys</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Connect Sunstrike to your own pipeline. Billed per render, same as the
          studio.
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
          <div>
            <p className="text-[11px] font-medium">Production key</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              vyr_live_•••••••••••••• 4d82
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Last used 2 days ago
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-white/10 bg-transparent text-[11px] hover:bg-white/[0.04]"
          >
            Revoke
          </Button>
        </div>
        <Button
          variant="outline"
          className="mt-3 h-8 rounded-lg border-dashed border-white/15 bg-transparent text-[11px] text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
        >
          <Plus className="size-3" />
          Create new key
        </Button>
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#18191c] p-4">
          <p className="text-[11px] text-muted-foreground">
            Quick start
          </p>
          <pre className="mt-2 overflow-x-auto text-[12px] leading-relaxed text-foreground/70">
{`curl https://api.sunstrike.ai/v1/videos \\
  -H "Authorization: Bearer $SUNSTRIKE_KEY" \\
  -d model="sunstrike-motion-2" \\
  -d prompt="A quiet shot of..."`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[210px_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.035] hover:text-foreground",
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

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.012]">
        {tab === "profile" ? <ProfilePane /> : null}
        {tab === "preferences" ? <PreferencesPane /> : null}
        {tab === "notifications" ? <NotificationsPane /> : null}
        {tab === "security" ? <SecurityPane /> : null}
        {tab === "api" ? <ApiPane /> : null}
      </div>
    </div>
  );
}
