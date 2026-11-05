import { Button } from "@/ui/button";

export const pricingSliderStyles =
  "[&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-track]]:bg-white/[0.12] [&_[data-slot=slider-range]]:min-w-3 [&_[data-slot=slider-range]]:rounded-full [&_[data-slot=slider-range]]:bg-brand-secondary [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-[0.1875rem] [&_[data-slot=slider-thumb]]:border-[#1c1e20] [&_[data-slot=slider-thumb]]:bg-brand-secondary [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:ring-1 [&_[data-slot=slider-thumb]]:ring-brand-secondary/55 [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-thumb]]:active:ring-1";

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
