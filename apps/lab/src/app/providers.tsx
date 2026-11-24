"use client";

import { useEffect } from "react";
import { Provider } from "jotai";
import { NavigationProgress } from "@/components/navigation-progress";
import { TooltipProvider } from "@/ui/tooltip";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
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
