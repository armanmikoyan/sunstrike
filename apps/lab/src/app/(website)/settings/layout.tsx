import { Settings } from "@/components/settings";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <Settings>{children}</Settings>;
}
