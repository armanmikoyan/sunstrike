import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100svh-3rem)] flex-1">{children}</main>
  );
}
