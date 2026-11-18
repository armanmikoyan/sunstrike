"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/ui/search-input";
import { NAV_COPY } from "./constants";
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
        router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore");
      }}
      role="search"
      className="min-w-0 max-w-42 flex-1 md:w-40 md:flex-none lg:max-w-none lg:w-52 xl:w-64"
    >
      <SearchInput
        value={query}
        onValueChange={setQuery}
        placeholder={compact ? NAV_COPY.compactSearch : NAV_COPY.search}
        ariaLabel={NAV_COPY.search}
        hint={shortcut}
        clearLabel={NAV_COPY.clearSearch}
        inputRef={searchRef}
      />
    </form>
  );
}
