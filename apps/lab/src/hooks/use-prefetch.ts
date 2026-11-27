"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function allowsPrefetch() {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return connection.effectiveType !== "slow-2g" && connection.effectiveType !== "2g";
}

/** Warms a route on intent, but stays off metered or very slow connections. */
export function usePrefetch() {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      if (!allowsPrefetch()) return;
      router.prefetch(href);
    },
    [router],
  );
}
