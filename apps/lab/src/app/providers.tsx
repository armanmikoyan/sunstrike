"use client";

import { useEffect } from "react";
import { Provider } from "jotai";
import { NavigationProgress } from "@/components/navigation-progress";
import { RouteWarmup } from "@/components/route-warmup";
import { TooltipProvider } from "@/ui/tooltip";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return (
    <Provider>
      <NavigationProgress />
      <RouteWarmup />
      <TooltipProvider delayDuration={180}>{children}</TooltipProvider>
    </Provider>
  );
}
