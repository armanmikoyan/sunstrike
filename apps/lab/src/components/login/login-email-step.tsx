import { ArrowRight, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "cn";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { loginCopy } from "./constants";
import type { LoginEmailStepProps } from "./types";

export function LoginEmailStep({
  active,
  email,
  emailValid,
  emailInputRef,
  pending,
  cooldown,
  emailBlocked,
  transition,
  onEmailChange,
  onSubmit,
}: LoginEmailStepProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      aria-hidden={!active}
      inert={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
      transition={transition}
      className={cn("col-start-1 row-start-1", !active && "pointer-events-none opacity-0")}
    >
      <label htmlFor="email" className="text-xs font-normal text-foreground/70">
        {loginCopy.emailLabel}
      </label>
      <Input
        ref={emailInputRef}
        id="email"
        type="email"
        autoComplete="email"
        placeholder={loginCopy.emailPlaceholder}
        value={email}
        onChange={onEmailChange}
        required
        disabled={pending !== null}
        className="mt-1.5 h-11 w-full rounded-lg border-white/8 bg-white/3.5 text-sm placeholder:text-muted-foreground lg:text-[0.8125rem]"
      />
      <Button
        type="submit"
        size="cta"
        className="mt-2 h-11 w-full text-sm font-normal lg:text-[0.8125rem]"
        disabled={!emailValid || pending !== null || cooldown > 0 || emailBlocked}
        aria-busy={pending === "email"}
      >
        {pending === "email" ? loginCopy.sending : loginCopy.sendCode}
        {pending === "email" ? (
          <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
        ) : (
          <ArrowRight className="size-3.5" />
        )}
      </Button>
    </motion.form>
  );
}
