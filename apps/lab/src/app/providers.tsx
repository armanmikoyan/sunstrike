"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "jotai";
import { NavigationProgress } from "@/components/navigation-progress";
import { TooltipProvider } from "@/ui/tooltip";

/**
 * App-level client providers. This lives beside the root layout because it is
 * runtime wiring, not a reusable component.
 */
export function Providers({ children }: { children: ReactNode }) {
  // A click before hydration does nothing. Marking the document once the tree
  // is interactive lets the e2e suite wait for the real thing instead of a
  // timer, which is also a useful signal for manual debugging.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return (
    <Provider>
      <NavigationProgress />
      <TooltipProvider delayDuration={180}>{children}</TooltipProvider>
    </Provider>
  );
}
