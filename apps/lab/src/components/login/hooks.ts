"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import type { OAuthProvider } from "@/app/api/auth/oauth/types";
import { safeNext } from "@/app/api/auth/utils";
import { SIGNED_IN_EVENT } from "@/components/auth/constants";
import { navigate, readMessage, startOAuthSignIn } from "@/components/auth/utils";
import {
  CODE_LENGTH,
  loginCopy,
  loginErrors,
  MAX_CODE_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
  SENDING_PHASE_MS,
  SENDS_BEFORE_WAIT,
} from "./constants";
import type { LoginPending, LoginStep, UseCodeInputOptions } from "./types";
import { collapseCaret, cooldownSeconds, isEmailQuotaError } from "./utils";

export function useLogin(next?: string, initialError?: string) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [pending, setPending] = useState<LoginPending>(null);
  const [emailValid, setEmailValid] = useState(false);
  const [error, setError] = useState(() => loginErrors[initialError ?? ""] ?? "");
  const [attempts, setAttempts] = useState(0);
  const [refocus, setRefocus] = useState(0);
  const [restart, setRestart] = useState(0);
  const [resending, setResending] = useState(false);
  const [sends, setSends] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [limitedByServer, setLimitedByServer] = useState(false);
  const [emailBlocked, setEmailBlocked] = useState(false);

  const requestAttempt = useRef(0);
  const emailInput = useRef<HTMLInputElement>(null);
  const previousStep = useRef<LoginStep>("email");
  const target = safeNext(next);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      const remaining = cooldown - 1;
      setCooldown(remaining);

      if (remaining === 0) {
        setSends(0);
        setLimitedByServer(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (pending !== "email" && !resending) return;

    const timer = setTimeout(() => {
      if (pending === "email") {
        setPending(null);
        setStep("code");
      } else {
        setResending(false);
      }
    }, SENDING_PHASE_MS);

    return () => clearTimeout(timer);
  }, [pending, resending]);

  useEffect(() => {
    const returning = previousStep.current === "code" && step === "email";
    previousStep.current = step;
    if (!returning) return;

    emailInput.current?.focus();
    emailInput.current?.select();
  }, [step]);

  useEffect(() => {
    if (!initialError) return;

    const loginPath = next ? `/login?next=${encodeURIComponent(target)}` : "/login";
    router.replace(loginPath, { scroll: false });
  }, [initialError, next, router, target]);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    const nextEmail = event.target.value;
    setEmail(nextEmail);

    if (cooldown > 0) setCooldown(0);
    if (limitedByServer) setLimitedByServer(false);

    if (emailBlocked) {
      setEmailBlocked(false);
      if (error === loginCopy.emailLimit) setError("");
    }

    setSends(0);
    setEmailValid(event.currentTarget.validity.valid && nextEmail.lastIndexOf(".") > nextEmail.lastIndexOf("@"));
  }

  function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void requestCode("send");
  }

  async function requestCode(kind: "send" | "resend") {
    if (pending !== null || resending || cooldown > 0 || emailBlocked) return;

    const attempt = ++requestAttempt.current;
    const request = sends + 1;

    setError("");
    setLimitedByServer(false);

    if (kind === "send") {
      setPending("email");
    } else {
      setResending(true);
      setRestart((value) => value + 1);
    }

    setToken("");
    setAttempts(0);
    setSends(request);
    setCooldown(request >= SENDS_BEFORE_WAIT ? RESEND_COOLDOWN_SECONDS : 0);

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (attempt !== requestAttempt.current) return;
      if (response.ok) return;

      setSends(sends);

      if (kind === "send") {
        setPending(null);
        setStep("email");
      } else {
        setResending(false);
      }

      if (response.status === 429) {
        const message = await readMessage(response, "");

        if (isEmailQuotaError(message)) {
          setCooldown(0);
          setEmailBlocked(true);
          setError(loginCopy.emailLimit);
          return;
        }

        setCooldown(cooldownSeconds(message));
        setLimitedByServer(true);
        return;
      }

      setCooldown(0);
      setError(await readMessage(response, loginCopy.unreachable));
    } catch {
      if (attempt !== requestAttempt.current) return;

      setSends(sends);

      if (kind === "send") {
        setPending(null);
        setStep("email");
      } else {
        setResending(false);
      }

      setCooldown(0);
      setError(loginCopy.unreachable);
    }
  }

  async function submitCode(code: string) {
    if (pending !== null || resending) return;

    requestAttempt.current += 1;
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

  async function continueWith(provider: OAuthProvider) {
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
    requestAttempt.current += 1;
    setStep("email");
    setToken("");
    setAttempts(0);
    setError("");
  }

  return {
    step,
    email,
    token,
    setToken,
    pending,
    emailValid,
    error,
    refocus,
    restart,
    resending,
    cooldown,
    limitedByServer,
    emailBlocked,
    emailInput,
    handleEmailChange,
    sendCode,
    requestCode,
    submitCode,
    continueWith,
    useDifferentEmail,
  };
}

export function useCodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  active = true,
  refocus,
  restart,
}: UseCodeInputOptions) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const handledRestart = useRef(restart ?? 0);
  const [focused, setFocused] = useState<number | null>(null);

  const digits = Array.from({ length: CODE_LENGTH }, (_, index) => value[index] ?? "");

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];
    if (!box) return;

    box.focus();
    collapseCaret(box);
  }

  useEffect(() => {
    if (active) focusBox(0);
  }, [active]);

  useEffect(() => {
    if (refocus) focusBox(CODE_LENGTH - 1);
  }, [refocus]);

  useEffect(() => {
    const next = restart ?? 0;
    if (next === handledRestart.current || disabled) return;

    handledRestart.current = next;
    focusBox(0);
  }, [restart, disabled]);

  function commit(next: string, focusIndex: number) {
    onChange(next);
    if (next.length === CODE_LENGTH) onComplete?.(next);
    focusBox(focusIndex);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const entered = event.target.value.replace(/\D/g, "");
    if (!entered) return;

    const at = Math.min(index, value.length);
    commit(
      (value.slice(0, at) + entered + value.slice(at + entered.length)).slice(0, CODE_LENGTH),
      at + entered.length,
    );
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (/^\d$/.test(event.key) && digits[index]) {
      event.preventDefault();
      commit(value.slice(0, index) + event.key + value.slice(index + 1), index + 1);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        commit(value.slice(0, index) + value.slice(index + 1), index);
      } else {
        commit(value.slice(0, -1), index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const entered = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!entered) return;

    event.preventDefault();
    const at = Math.min(index, value.length);
    const room = CODE_LENGTH - at;
    commit((value.slice(0, at) + entered.slice(0, room) + value.slice(at)).slice(0, CODE_LENGTH), at + room);
  }

  return {
    boxes,
    digits,
    focused,
    setFocused,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
}
