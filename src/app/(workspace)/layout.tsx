import type { ReactNode } from "react";
import { AppShell } from "@/app/shell";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <main className="min-h-[calc(100svh-3rem)] flex-1">{children}</main>
    </AppShell>
  );
}
