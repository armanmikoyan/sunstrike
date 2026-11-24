import { LoaderCircle } from "lucide-react";
import { OAUTH_PROVIDERS } from "@/app/api/auth/oauth/constants";
import { ProviderIcon } from "@/components/auth/provider-icon";
import { Button } from "@/ui/button";
import { loginCopy } from "./constants";
import type { LoginOAuthButtonsProps } from "./types";

export function LoginOAuthButtons({ pending, onSelect }: LoginOAuthButtonsProps) {
  return (
    <>
      <div className="mt-7 grid gap-2">
        {OAUTH_PROVIDERS.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="relative h-10 w-full rounded-lg border-white/9 bg-white/1.5 px-4 text-sm font-normal text-foreground hover:bg-white/5 lg:text-[0.8125rem]"
            onClick={() => onSelect(provider)}
            disabled={pending !== null}
            aria-busy={pending === provider}
          >
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
    </>
  );
}
