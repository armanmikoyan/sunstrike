"use client";

import { useRequireAuth } from "@/components/auth/hooks";
import type { AuthGateProps } from "./types";

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) return null;

  return <>{children}</>;
}
