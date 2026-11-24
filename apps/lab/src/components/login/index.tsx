"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { LogoLockup } from "@/components/brand";
import { loginCopy, STEP_SWAP } from "./constants";
import { useLogin } from "./hooks";
import { LoginCodeStep } from "./login-code-step";
import { LoginEmailStep } from "./login-email-step";
import { LoginFeedback } from "./login-feedback";
import { LoginHero } from "./login-hero";
import { LoginOAuthButtons } from "./login-oauth-buttons";
import type { LoginProps } from "./types";

export function Login({ next, initialError }: LoginProps) {
  const login = useLogin(next, initialError);
  const reduceMotion = useReducedMotion();
  const swap = reduceMotion ? { duration: 0 } : STEP_SWAP;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.08fr_1fr]">
      <LoginHero />

      <section className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <LogoLockup compact className="w-40" />
          <Link href="/" className="text-xs text-muted-foreground lg:text-[0.6875rem]">
            {loginCopy.backToStudio}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-md rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] px-6 py-9 text-sm shadow-[0_2rem_4rem_-2.5rem_rgba(0,0,0,0.75)] lg:text-[0.8125rem]">
            <h2 className="text-[1.75rem] font-medium tracking-[-0.05em]">{loginCopy.title}</h2>

            <LoginOAuthButtons pending={login.pending} onSelect={(provider) => void login.continueWith(provider)} />

            <div className="grid">
              <LoginEmailStep
                active={login.step === "email"}
                email={login.email}
                emailValid={login.emailValid}
                emailInputRef={login.emailInput}
                pending={login.pending}
                cooldown={login.cooldown}
                emailBlocked={login.emailBlocked}
                transition={swap}
                onEmailChange={login.handleEmailChange}
                onSubmit={login.sendCode}
              />

              <LoginCodeStep
                active={login.step === "code"}
                email={login.email}
                token={login.token}
                pending={login.pending}
                resending={login.resending}
                cooldown={login.cooldown}
                emailBlocked={login.emailBlocked}
                refocus={login.refocus}
                restart={login.restart}
                transition={swap}
                onTokenChange={login.setToken}
                onComplete={(code) => void login.submitCode(code)}
                onUseDifferentEmail={login.useDifferentEmail}
                onResend={() => void login.requestCode("resend")}
              />
            </div>

            <LoginFeedback
              error={login.error}
              step={login.step}
              pending={login.pending}
              resending={login.resending}
              cooldown={login.cooldown}
              limitedByServer={login.limitedByServer}
            />
          </div>
        </div>

        <div className="p-5 text-center text-xs text-muted-foreground lg:hidden lg:text-[0.6875rem]">
          {loginCopy.footer}
        </div>
      </section>
    </main>
  );
}
