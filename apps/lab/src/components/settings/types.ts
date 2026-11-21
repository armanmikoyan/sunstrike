import type { ReactNode } from "react";

/** 02 Core entities — `users`. */
export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type SettingsTab = "account" | "notifications" | "billing" | "usage";

export type FieldProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export type SettingsGateProps = {
  children: ReactNode;
};
