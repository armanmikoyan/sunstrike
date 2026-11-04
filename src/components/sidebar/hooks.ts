"use client";

import { usePathname } from "next/navigation";

export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/create/video") return pathname.startsWith("/create");
    return pathname === href;
  };
}
