"use client";

import { useRef, type ComponentProps, type RefObject } from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";

type SearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  hint?: string;
  clearLabel?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onFocus?: ComponentProps<"input">["onFocus"];
  className?: string;
};

export function SearchInput({
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  hint,
  clearLabel = "Clear search",
  inputRef,
  onFocus,
  className,
}: SearchInputProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const fieldRef = inputRef ?? internalRef;
  const showHint = Boolean(hint) && value.length === 0;

  const clear = () => {
    onValueChange("");
    fieldRef.current?.focus();
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={fieldRef}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onValueChange("");
            event.currentTarget.blur();
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-lg border border-white/8 bg-white/3.5 pl-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-white/8 focus-visible:bg-white/5 focus-visible:ring-0 lg:h-8 lg:text-[0.6875rem] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          value ? "pr-9" : showHint ? "pr-2.5 lg:pr-11" : "pr-2.5",
        )}
      />

      {value || showHint ? (
        <div className="absolute inset-y-0 right-1.5 flex items-center">
          {value ? (
            <button
              type="button"
              onClick={clear}
              aria-label={clearLabel}
              className="grid size-3.5 shrink-0 appearance-none place-items-center rounded-full bg-white/20 p-0 leading-none text-background transition-colors hover:bg-white/35"
            >
              <X className="block size-3 shrink-0" strokeWidth={2.5} />
            </button>
          ) : (
            <kbd
              aria-hidden
              className="pointer-events-none hidden items-center rounded border border-white/8 bg-white/5 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] leading-none text-muted-foreground lg:flex"
            >
              {hint}
            </kbd>
          )}
        </div>
      ) : null}
    </div>
  );
}
