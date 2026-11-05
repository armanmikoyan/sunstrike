"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navCopy } from "./constants";
import { useCompactNav, useShortcutLabel } from "./hooks";

export function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  // Read from the browser instead of setting state in an effect: the server
  // snapshot keeps hydration quiet, the client snapshot swaps in after mount.
  const shortcut = useShortcutLabel();
  const compact = useCompactNav();

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => {
      window.removeEventListener("keydown", focusSearch);
    };
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const term = query.trim();
        router.push(
          term ? `/explore?q=${encodeURIComponent(term)}` : "/explore",
        );
      }}
      role="search"
      className="group relative flex h-9 min-w-0 flex-1 items-center md:w-[11.25rem] md:flex-none lg:w-[15rem] xl:w-[18.75rem]"
    >
      <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
            event.currentTarget.blur();
          }
        }}
        placeholder={
          compact ? navCopy.compactSearch : navCopy.search
        }
        aria-label={navCopy.search}
        className={cn(
          "h-9 w-full appearance-none rounded-lg border border-white/[0.08] bg-white/[0.035] pl-8 text-[0.75rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-white/25 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          query.length === 0 ? "pr-2.5 lg:pr-11" : "pr-9 lg:pr-11",
        )}
      />

      {/* One slot at the far right: the hotkey hint while empty,
          the clear affordance once there is something to clear. */}
      <div className="absolute inset-y-0 right-1.5 flex items-center">
        {query.length === 0 ? (
          <kbd
            aria-hidden
            className="pointer-events-none hidden items-center rounded border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none text-muted-foreground lg:flex"
          >
            {shortcut}
          </kbd>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
            aria-label={navCopy.clearSearch}
            className="grid size-[1.125rem] place-items-center rounded-full bg-white/20 text-background transition-colors hover:bg-white/35"
          >
            <X className="size-[0.6875rem]" strokeWidth={3} />
          </button>
        )}
      </div>
    </form>
  );
}
