"use client";

import { useEffect } from "react";
import { Provider } from "jotai";
import { NavigationProgress } from "@/components/navigation-progress";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
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
