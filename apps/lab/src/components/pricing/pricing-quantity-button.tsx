export function QuantityButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="grid size-9 shrink-0 place-items-center rounded-full bg-white/5 text-muted-foreground outline-none transition-colors hover:bg-white/12 hover:text-foreground active:bg-white/16 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}
