import { Link } from "@/components/link";
import { loginCopy } from "./constants";
import type { LoginFeedbackProps } from "./types";

export function LoginFeedback({ error, step, pending, resending, cooldown, limitedByServer }: LoginFeedbackProps) {
  const showCooldown = pending === null && !resending && cooldown > 0 && (step === "email" || limitedByServer);

  return (
    <div className="mt-4">
      <div aria-live="polite" className="min-h-5 text-xs leading-relaxed">
        {error ? (
          <p role="alert" className="text-red-400">
            {error}
          </p>
        ) : showCooldown ? (
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
  );
}
