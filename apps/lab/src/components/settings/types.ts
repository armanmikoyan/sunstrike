import type { ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type SettingsTab = "account" | "notifications" | "billing" | "usage";

export type SettingsProps = {
  children: ReactNode;
};

export type FieldProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};
