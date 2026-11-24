import type { StudioFieldProps } from "./types";

export function StudioField({ label, children }: StudioFieldProps) {
  return (
    <div className="mt-5">
      <p className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
