import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { Settings } from "@/components/settings";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Settings>
      <AuthGate>{children}</AuthGate>
    </Settings>
  );
}
