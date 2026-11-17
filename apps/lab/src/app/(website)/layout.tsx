import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-[calc(100svh-3rem)] flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
