import {
  Bell,
  KeyRound,
  Laptop,
  Monitor,
  Shield,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import type { NotificationKey, SettingsTab } from "./types";

export const settingsNav: { key: SettingsTab; label: string; icon: typeof Bell }[] =
  [
    { key: "profile", label: "Profile", icon: UserRound },
    { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
    { key: "api", label: "API keys", icon: KeyRound },
  ];

export const notificationRows: {
  key: NotificationKey;
  title: string;
  description: string;
}[] = [
  {
    key: "rendered",
    title: "Render complete",
    description: "Let me know when a video or image is ready.",
  },
  {
    key: "credits",
    title: "Balance and top-ups",
    description: "Receipts, auto top-up and low balance warnings.",
  },
  {
    key: "product",
    title: "New models and tools",
    description: "Occasional notes when a new model lands.",
  },
  {
    key: "community",
    title: "Community activity",
    description: "Likes, follows and replies on published work.",
  },
  {
    key: "digest",
    title: "Weekly studio digest",
    description: "A short roundup of what you made and spent.",
  },
];

export const notificationDefaults: Record<NotificationKey, boolean> = {
  rendered: true,
  credits: true,
  product: false,
  community: false,
  digest: true,
};

export const sessions = [
  {
    icon: Laptop,
    device: "MacBook Pro · Chrome",
    location: "Yerevan, Armenia",
    current: true,
  },
  {
    icon: Monitor,
    device: "iPad Pro · Safari",
    location: "Yerevan, Armenia",
    current: false,
  },
];

export const apiQuickStart = `curl https://api.chronolab.ai/v1/videos \\
  -H "Authorization: Bearer $CHRONOLAB_KEY" \\
  -d model="chronolab-motion-2" \\
  -d prompt="A quiet shot of..."`;
