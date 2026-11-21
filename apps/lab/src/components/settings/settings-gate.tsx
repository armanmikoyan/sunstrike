"use client";

import { useRequireAuth } from "@/components/auth/hooks";
import type { SettingsGateProps } from "./types";

export function SettingsGate({ children }: SettingsGateProps) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) return null;

  return <>{children}</>;
}
