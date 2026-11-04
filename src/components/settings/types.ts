import type { ReactNode } from "react";

export type SettingsTab =
  | "profile"
  | "preferences"
  | "notifications"
  | "security"
  | "api";

export type NotificationKey =
  | "rendered"
  | "credits"
  | "product"
  | "community"
  | "digest";

export type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};
