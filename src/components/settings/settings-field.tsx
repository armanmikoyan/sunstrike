import type { FieldProps } from "./types";

export function SettingsField({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="text-[0.6875rem] font-medium text-foreground/80">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1.5 text-[0.6875rem] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
