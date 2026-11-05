"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/ui/button";
import { sessions, settingsCopy } from "./constants";

export function SettingsSecurityPane() {
  const copy = settingsCopy.security;
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="size-3.5 text-muted-foreground" />
            <p className="text-[0.6875rem] font-medium">{copy.password}</p>
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">
            {copy.passwordHint}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-7 rounded-lg border-white/10 bg-transparent text-[0.6875rem] hover:bg-white/[0.04]"
          >
            {copy.changePassword}
          </Button>
        </div>

        <div className="rounded-xl border border-white/[0.07]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-[0.6875rem] font-medium">{copy.activeSessions}</p>
          </div>
          {sessions.map((session) => (
            <div
              key={session.device}
              className="flex items-center gap-3 border-b border-white/[0.055] px-4 py-3 last:border-0"
            >
              <span className="grid size-7 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-muted-foreground">
                <session.icon className="size-3" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem]">{session.device}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {session.location}
                </p>
              </div>
              {session.current ? (
                <span className="text-[0.6875rem] text-foreground">
                  {copy.current}
                </span>
              ) : (
                <button
                  type="button"
                  className="text-[0.6875rem] text-muted-foreground hover:text-foreground"
                >
                  {copy.revoke}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[0.07] p-4">
          <p className="text-[0.6875rem] font-medium">{copy.apiKey}</p>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">
            {copy.apiKeyHint}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-white/[0.07] bg-black/20 px-2.5 py-2 font-mono text-[0.6875rem] text-muted-foreground">
              {showKey ? copy.apiKeyRevealed : copy.apiKeyMasked}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              onClick={() => setShowKey((value) => !value)}
              aria-label={showKey ? copy.hideKey : copy.showKey}
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
              aria-label={copy.copyKey}
            >
              {copied ? (
                <Check className="size-3.5 text-foreground" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[0.6875rem] text-muted-foreground">
              {copy.created}
            </p>
            <button
              type="button"
              className="text-[0.6875rem] text-destructive hover:underline"
            >
              {copy.revokeKey}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
