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

export const settingsCopy = {
  eyebrow: "Account",
  title: "Settings",
  description:
    "Manage your studio profile, render defaults and account security.",
  balanceAction: "Pay as you go · $10.54",
  save: {
    saved: "Saved",
    action: "Save changes",
  },
  profile: {
    title: "Profile",
    description: "How you appear across the studio and the community feed.",
    initials: "AM",
    uploadPhoto: "Upload photo",
    remove: "Remove",
    photoHint: "JPG or PNG. 2 MB max.",
    displayName: "Display name",
    displayNameValue: "Arman Mikoyan",
    username: "Username",
    usernameValue: "arman",
    email: "Email",
    emailHint: "Used for render notifications and receipts.",
    emailValue: "arman@chronolab.ai",
    bio: "Bio",
    bioValue:
      "Director and motion designer. Building a small studio for image, film and everything in between.",
    location: "Location",
    locationValue: "Yerevan, Armenia",
    website: "Website",
    websiteValue: "chronolab.ai",
  },
  preferences: {
    title: "Studio preferences",
    description: "Set the defaults that open with each new generation.",
    defaultVideoModel: "Default video model",
    videoModel: "Chronolab Motion 2",
    videoMeta: "$0.51 · 6s",
    defaultImageModel: "Default image model",
    imageModel: "Chronolab Image 2",
    imageMeta: "$0.07 · 1 MP",
    defaultAspect: "Default aspect ratio",
    aspectValue: "16:9",
    defaultResolution: "Default resolution",
    resolutionValue: "1080p",
    fpsValue: "24 fps",
    switches: [
      {
        title: "Autoplay previews",
        description: "Loop community and library clips automatically.",
      },
      {
        title: "Reduce interface motion",
        description: "Pause the community wall and other ambient movement.",
      },
      {
        title: "Auto-clean failed renders",
        description: "Remove failed generations after 7 days.",
      },
    ],
  },
  notifications: {
    title: "Notifications",
    description: "Choose what reaches your inbox.",
  },
  security: {
    title: "Security",
    description: "Sessions, keys and account protection.",
    password: "Password",
    passwordHint: "Last changed 3 months ago.",
    changePassword: "Change password",
    activeSessions: "Active sessions",
    current: "Current",
    revoke: "Revoke",
    apiKey: "API key",
    apiKeyHint: "Use this key for the Chronolab API. Keep it private.",
    apiKeyMasked: "vyr_live_••••••••••••",
    apiKeyRevealed: "vyr_live_4d82f1a997c34e2b",
    showKey: "Show API key",
    hideKey: "Hide API key",
    copyKey: "Copy API key",
    created: "Created Oct 12, 2026 · never used",
    revokeKey: "Revoke key",
  },
  api: {
    title: "API keys",
    description:
      "Connect Chronolab to your own pipeline. Billed per render, same as the studio.",
    productionKey: "Production key",
    maskedKey: "vyr_live_•••••••••••••• 4d82",
    lastUsed: "Last used 2 days ago",
    revoke: "Revoke",
    createKey: "Create new key",
    quickStart: "Quick start",
  },
};

