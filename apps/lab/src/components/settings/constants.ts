import { Bell, CreditCard, Gauge, UserRound } from "lucide-react";
import type { SettingsTab } from "./types";

export const SETTINGS_NAV: {
  key: SettingsTab;
  label: string;
  href: string;
  icon: typeof Bell;
}[] = [
  {
    key: "account",
    label: "Account",
    href: "/settings/account",
    icon: UserRound,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    key: "billing",
    label: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    key: "usage",
    label: "Usage",
    href: "/settings/usage",
    icon: Gauge,
  },
];

export const SETTINGS_COPY = {
  eyebrow: "Account",
  title: "Settings",
  description: "Your account, balance and the notifications tied to your generations.",
  save: {
    saved: "Saved",
    action: "Save changes",
  },
  account: {
    title: "Account",
    description: "The email used for sign-in and generation notifications.",
    email: "Email",
    emailHint: "Used for sign-in and generation notifications.",
    userId: "User ID",
    createdAt: "Created",
    dateLocale: "en-US",
  },
  notifications: {
    title: "Notifications",
    description: "Every update tied to a generation, newest first.",
    empty: "No notifications yet.",
    read: "Read",
    unread: "Unread",
  },
};
