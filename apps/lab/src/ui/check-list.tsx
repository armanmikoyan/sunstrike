import type { ComponentProps } from "react";
import { cn } from "cn";
import { Check } from "lucide-react";

type CheckListProps = Omit<ComponentProps<"div">, "children"> & { items: readonly string[] };

export function CheckList({ items, className, ...props }: CheckListProps) {
  return (
    <div className={cn("flex flex-wrap gap-4", className)} {...props}>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
          <Check className="size-3.5 text-muted-foreground" />
          {item}
        </span>
      ))}
    </div>
  );
}
