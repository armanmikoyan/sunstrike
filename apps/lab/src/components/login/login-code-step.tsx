import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "cn";
import { CodeInput } from "./code-input";
import { loginCopy } from "./constants";
import type { LoginCodeStepProps } from "./types";

export function LoginCodeStep({
  active,
  email,
  token,
  pending,
  resending,
  cooldown,
  emailBlocked,
  refocus,
  restart,
  transition,
  onTokenChange,
  onComplete,
  onUseDifferentEmail,
  onResend,
}: LoginCodeStepProps) {
  return (
    <motion.form
      onSubmit={(event) => {
        event.preventDefault();
        onComplete(token);
      }}
      aria-hidden={!active}
      inert={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : -14 }}
      transition={transition}
      className={cn("col-start-1 row-start-1", !active && "pointer-events-none opacity-0")}
    >
      <div>
        <span id="code-label" className="text-xs font-normal text-foreground/70">
          {loginCopy.codeLabel}
        </span>
        <CodeInput
          value={token}
          onChange={onTokenChange}
          onComplete={onComplete}
          labelledBy="code-label"
          disabled={pending !== null || resending}
          busy={pending === "code"}
          active={active}
          refocus={refocus}
          restart={restart}
        />
      </div>

      <p
        role="status"
        title={email}
        className="mt-3 truncate text-xs leading-4 text-muted-foreground lg:text-[0.8125rem]"
      >
        {loginCopy.codeSentBefore}
        {email}
      </p>

      <div className="mt-2 flex min-h-4 items-center gap-3">
        <button
          type="button"
          onClick={onUseDifferentEmail}
          disabled={pending !== null || resending}
          className="shrink-0 text-xs leading-4 text-brand-secondary underline-offset-2 transition-colors hover:text-brand-tertiary hover:underline disabled:pointer-events-none disabled:opacity-50 lg:text-[0.8125rem]"
        >
          {loginCopy.differentEmail}
        </button>

        <span className="ml-auto flex min-w-0 items-center gap-1.5 text-xs leading-4 text-brand-secondary lg:text-[0.8125rem]">
          {pending === "code" ? (
            <span aria-live="polite" className="flex items-center gap-1.5">
              <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" />
              {loginCopy.verifying}
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={cooldown > 0 || resending || pending !== null || emailBlocked}
              aria-busy={resending}
              className="flex shrink-0 items-center gap-1.5 underline-offset-2 transition-colors hover:text-brand-tertiary hover:underline disabled:pointer-events-none disabled:no-underline disabled:opacity-60"
            >
              {resending ? <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" /> : null}
              {resending
                ? loginCopy.sending
                : cooldown > 0
                  ? loginCopy.resendIn.replace("{seconds}", String(cooldown))
                  : loginCopy.resendCode}
            </button>
          )}
        </span>
      </div>
    </motion.form>
  );
}
