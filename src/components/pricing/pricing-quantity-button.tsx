import { Button } from "@/ui/button";

export function QuantityButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="grid size-9 place-items-center rounded-full border border-white/15 p-0 text-lg font-normal leading-none text-muted-foreground hover:border-brand-secondary/40 hover:bg-transparent hover:text-brand-secondary disabled:cursor-not-allowed disabled:opacity-30"
      {...props}
    >
      {children}
    </Button>
  );
}
