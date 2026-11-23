"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clapperboard, LoaderCircle, Maximize } from "lucide-react";
import { LogoLockup } from "@/components/brand";
import { cn } from "cn";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { navigate, readMessage, safeNext, startOAuthSignIn } from "@/components/auth/utils";
import { SIGNED_IN_EVENT } from "@/components/auth/constants";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { mediaById } from "@/mocks/media";
import {
  loginCopy,
  loginErrors,
  loginHeroId,
  loginProviders,
  loginThumbnailIds,
  MAX_CODE_ATTEMPTS,
  SENDING_PHASE_MS,
} from "./constants";
import { CodeInput } from "./code-input";
import { cooldownSeconds } from "./utils";
import { ProviderIcon } from "@/components/auth/provider-icon";
import type { LoginPending, LoginProps, LoginProvider, LoginStep } from "./types";

const thumbnails = loginThumbnailIds.map((id) => mediaById(id)).filter((item) => item !== undefined);

export function Login({ next, initialError }: LoginProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [pending, setPending] = useState<LoginPending>(null);
  const [emailValid, setEmailValid] = useState(false);
  const [error, setError] = useState(() => loginErrors[initialError ?? ""] ?? "");
  const [attempts, setAttempts] = useState(0);
  const [refocus, setRefocus] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const sendAttempt = useRef(0);
  const hero = mediaById(loginHeroId);
  const target = safeNext(next);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((left) => left - 1), 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (pending !== "email") return;

    // Keep the sending state visible for a beat instead of flipping the screen
    // instantly. The request settles in the background; a failure cancels this
    // phase and rolls back to the email form.
    const timer = setTimeout(() => {
      setPending(null);
      setStep("code");
      setToken("");
      setAttempts(0);
    }, SENDING_PHASE_MS);

    return () => clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    if (!initialError) return;

    const loginPath = next ? `/login?next=${encodeURIComponent(target)}` : "/login";
    router.replace(loginPath, { scroll: false });
  }, [initialError, next, router, target]);

  function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending !== null) return;

    setError("");
    setPending("email");

    const attempt = ++sendAttempt.current;

    void sendCodeInBackground(email, attempt);
  }

  async function sendCodeInBackground(address: string, attempt: number) {
    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: address }),
      });

      if (attempt !== sendAttempt.current) return;

      if (response.ok) return;

      setPending(null);
      setStep("email");
      setToken("");
      setAttempts(0);

      if (response.status === 429) {
        // Supabase's sentence is accurate but reads like a log line. Show a
        // countdown instead, and keep the send button off until it ends.
        setCooldown(cooldownSeconds(await readMessage(response, "")));
        return;
      }

      setError(await readMessage(response, loginCopy.unreachable));
    } catch {
      if (attempt !== sendAttempt.current) return;

      setPending(null);
      setStep("email");
      setToken("");
      setAttempts(0);
      setError(loginCopy.unreachable);
    }
  }

  async function submitCode(code: string) {
    if (pending !== null) return;

    // Once a code is being checked, a late send failure should not pull the
    // screen back; verify has its own result to show.
    sendAttempt.current += 1;
    setError("");
    setPending("code");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });

      if (!response.ok) {
        const canRetry = response.status < 500 && response.status !== 429;

        if (!canRetry) {
          setError(
            response.status === 429
              ? loginCopy.verifyCooldown.replace("{seconds}", String(cooldownSeconds(await readMessage(response, ""))))
              : await readMessage(response, loginCopy.unreachable),
          );
          setPending(null);
          return;
        }

        const used = attempts + 1;
        setPending(null);

        // Out of tries: drop the code step and let them pick a method again.
        if (used >= MAX_CODE_ATTEMPTS) {
          setStep("email");
          setToken("");
          setAttempts(0);
          setError(loginCopy.tooManyCodes);
          return;
        }

        setAttempts(used);
        setRefocus((value) => value + 1);
        setError(
          (used === MAX_CODE_ATTEMPTS - 1 ? loginCopy.wrongCodeLast : loginCopy.wrongCode).replace(
            "{remaining}",
            String(MAX_CODE_ATTEMPTS - used),
          ),
        );
        return;
      }

      setAttempts(0);
      window.dispatchEvent(new Event(SIGNED_IN_EVENT));
      router.replace(target);
      router.refresh();
    } catch {
      setError(loginCopy.unreachable);
      setPending(null);
    }
  }

  async function continueWith(provider: LoginProvider) {
    setError("");
    setPending(provider);

    try {
      const result = await startOAuthSignIn(provider, target, loginCopy.unreachable);

      if (!result.ok) {
        setError(result.error);
        setPending(null);
        return;
      }

      navigate(result.url);
    } catch {
      setError(loginCopy.unreachable);
      setPending(null);
    }
  }

  function useDifferentEmail() {
    sendAttempt.current += 1;
    setStep("email");
    setToken("");
    setAttempts(0);
    setError("");
  }

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.08fr_1fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        {hero ? (
          <VideoWithFallback
            src={hero.src}
            poster={hero.poster}
            fallback={hero.fallback}
            preload="auto"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-[#08090b]/20 to-[#08090b]/70" />

        <div className="relative flex min-h-screen flex-col justify-between p-8 xl:p-10">
          <LogoLockup className="w-72" />

          <div className="max-w-125">
            <p className="text-xs lg:text-[0.6875rem] text-white/70">{loginCopy.brand}</p>
            <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.06em] text-white">
              {loginCopy.heroTitleBefore}
              <br />
              <span className="font-display font-normal">{loginCopy.heroTitleAccent}</span>
            </h1>
            <p className="mt-4 max-w-90 text-sm leading-relaxed text-white/55 lg:text-xs">
              {loginCopy.heroDescription}
            </p>

            <div className="mt-7 flex items-end gap-2">
              {thumbnails.map((item, index) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg border border-white/15 bg-secondary"
                  style={{
                    width: index === 1 ? "6.5rem" : "5.125rem",
                    height: index === 1 ? "8rem" : "6.5rem",
                  }}
                >
                  <Image src={item.poster} alt={item.title} fill sizes="120px" className="object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                    {item.title}
                  </span>
                </div>
              ))}
              <div className="ml-1 flex flex-col gap-2 pb-1">
                <span className="flex items-center gap-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                  <Clapperboard className="size-3 text-white/70" />
                  {loginCopy.motion}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                  <Maximize className="size-3 text-white/70" />
                  {loginCopy.upscale}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs lg:text-[0.6875rem] text-white/60">{loginCopy.copyright}</p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <LogoLockup compact className="w-40" />
          <Link href="/" className="text-xs lg:text-[0.6875rem] text-muted-foreground">
            {loginCopy.backToStudio}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-md rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] px-6 py-9 text-sm shadow-[0_2rem_4rem_-2.5rem_rgba(0,0,0,0.75)] lg:text-[0.8125rem]">
            <h2 className="text-[1.75rem] font-medium tracking-[-0.05em]">{loginCopy.title}</h2>

            <div className="mt-7 grid gap-2">
              {loginProviders.map((provider) => (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  className="relative h-10 w-full rounded-lg border-white/9 bg-white/1.5 px-4 text-sm font-normal text-foreground hover:bg-white/5 lg:text-[0.8125rem]"
                  onClick={() => continueWith(provider)}
                  disabled={pending !== null}
                  aria-busy={pending === provider}
                >
                  {/* Centred pair: the icon travels with its label, so each
                      button's content reads as one balanced unit. */}
                  <span className="flex items-center justify-center gap-2">
                    <span className="grid place-items-center">
                      {pending === provider ? (
                        <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
                      ) : (
                        <ProviderIcon provider={provider} className="size-3.5" />
                      )}
                    </span>
                    <span className="min-w-0 truncate">
                      {pending === provider ? loginCopy.connecting : loginCopy[provider]}
                    </span>
                  </span>
                </Button>
              ))}
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{loginCopy.or}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Both steps are built to the same height: the email form's
                label + input + button match the code form's sent line +
                label + boxes + action row. They also share one grid cell, so
                font rounding cannot shift the centred column either. The idle
                form stays laid out but is invisible, inert and hidden from
                assistive tech. */}
            <div className="grid">
              <form
                onSubmit={sendCode}
                aria-hidden={step !== "email"}
                inert={step !== "email"}
                className={cn("col-start-1 row-start-1", step !== "email" && "invisible")}
              >
                <label htmlFor="email" className="text-xs font-normal text-foreground/70">
                  {loginCopy.emailLabel}
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={loginCopy.emailPlaceholder}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailValid(
                      event.currentTarget.validity.valid &&
                        event.currentTarget.value.lastIndexOf(".") > event.currentTarget.value.lastIndexOf("@"),
                    );
                  }}
                  required
                  disabled={pending !== null}
                  className="mt-1.5 h-11 w-full rounded-lg border-white/8 bg-white/3.5 text-sm placeholder:text-muted-foreground lg:text-[0.8125rem]"
                />
                <Button
                  type="submit"
                  size="cta"
                  className="mt-2 h-11 w-full text-sm font-normal lg:text-[0.8125rem]"
                  disabled={!emailValid || pending !== null || cooldown > 0}
                  aria-busy={pending === "email"}
                >
                  {pending === "email" ? loginCopy.sending : loginCopy.sendCode}
                  {pending === "email" ? (
                    <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <ArrowRight className="size-3.5" />
                  )}
                </Button>
              </form>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitCode(token);
                }}
                aria-hidden={step !== "code"}
                inert={step !== "code"}
                className={cn("col-start-1 row-start-1", step !== "code" && "invisible")}
              >
                <div>
                  <span id="code-label" className="text-xs font-normal text-foreground/70">
                    {loginCopy.codeLabel}
                  </span>
                  <CodeInput
                    value={token}
                    onChange={setToken}
                    onComplete={submitCode}
                    labelledBy="code-label"
                    disabled={pending !== null}
                    busy={pending === "code"}
                    active={step === "code"}
                    refocus={refocus}
                  />
                </div>
                <p
                  role="status"
                  title={email}
                  className="mt-3 truncate text-xs leading-4 text-muted-foreground lg:text-[0.8125rem]"
                >
                  {loginCopy.codeSentBefore}
                  {email}
                  {loginCopy.codeSentAfter}
                </p>
                {/* One row: the escape hatch on the left, under the first
                    box, with the verify hint pushed to the right. Both step
                    forms share one grid cell, so their heights never move the
                    column around when the step swaps. */}
                <div className="mt-2 flex min-h-4 items-center gap-3">
                  <button
                    type="button"
                    onClick={useDifferentEmail}
                    disabled={pending !== null}
                    className="shrink-0 text-xs leading-4 text-brand-secondary underline-offset-2 lg:text-[0.8125rem] transition-colors hover:text-brand-tertiary hover:underline disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loginCopy.differentEmail}
                  </button>
                  <span
                    aria-live="polite"
                    className="ml-auto flex min-w-0 items-center gap-1.5 text-xs leading-4 text-brand-secondary lg:text-[0.8125rem]"
                  >
                    {pending === "code" ? (
                      <>
                        <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" />
                        {loginCopy.verifying}
                      </>
                    ) : null}
                  </span>
                </div>
              </form>
            </div>

            {/* The consent line sits directly under the step. The feedback
                slot keeps one line of height at all times, so a cooldown or
                error never pushes the centred column around; an idle form
                shows no text there. */}
            <div className="mt-4">
              <div aria-live="polite" className="min-h-5 text-xs leading-relaxed">
                {error ? (
                  <p role="alert" className="text-red-400">
                    {error}
                  </p>
                ) : step === "email" && cooldown > 0 ? (
                  <p role="status" className="text-muted-foreground">
                    {loginCopy.cooldownBefore}
                    <span className="tabular-nums text-brand-secondary">{cooldown}s</span>
                    {loginCopy.cooldownAfter}
                  </p>
                ) : null}
              </div>

              <p className="mt-1 text-left text-xs leading-relaxed text-muted-foreground">
                {loginCopy.termsBefore}
                <Link href="/terms" className="underline underline-offset-2">
                  {loginCopy.terms}
                </Link>
                {loginCopy.termsAnd}
                <Link href="/privacy" className="underline underline-offset-2">
                  {loginCopy.privacy}
                </Link>
                {loginCopy.termsAfter}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 text-center text-xs text-muted-foreground lg:hidden lg:text-[0.6875rem]">
          {loginCopy.footer}
        </div>
      </section>
    </main>
  );
}
