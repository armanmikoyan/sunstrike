export type SettingsTab = "account" | "notifications" | "billing" | "usage";

export type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};
