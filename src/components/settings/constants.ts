import { Bell, UserRound } from "lucide-react";
import type { User } from "@/lib/design";
import type { SettingsTab } from "./types";

export const currentUser: User = {
  id: "usr_01",
  email: "arman@chronolab.ai",
  createdAt: "2026-08-14T09:00:00.000Z",
};

export const settingsNav: { key: SettingsTab; label: string; icon: typeof Bell }[] =
  [
    { key: "account", label: "Account", icon: UserRound },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

export const settingsCopy = {
  eyebrow: "Account",
  title: "Settings",
  description: "Your account and the notifications tied to your generations.",
  balanceAction: "Pay as you go · $10.54",
  save: {
    saved: "Saved",
    action: "Save changes",
  },
  account: {
    title: "Account",
    description: "The email used for sign-in and render notifications.",
    email: "Email",
    emailHint: "Used for sign-in and render notifications.",
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
