import type { ComponentProps } from "react";
import { cn } from "cn";

export function PageShell({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("w-full px-5 py-7", className)} {...props} />;
}
