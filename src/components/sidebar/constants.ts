import {
  CircleHelp,
  Coins,
  Compass,
  CreditCard,
  Film,
  FolderOpen,
  Heart,
  Layers,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const EXIT_MS = 260;

// The primary action is a solid brand key: no border, and a dark line inset
// along the bottom edge so it reads as a physical, pressable button.
export const CTA_BEVEL = "inset 0 -0.1875rem 0 0 rgba(0, 0, 0, 0.43)";

export const ACCOUNT = {
  email: "arman@chronolab.ai",
  balance: "$10.54",
} as const;

export const accountMenuCopy = {
  account: "Account",
  balance: "Balance",
  signOut: "Sign out",
};

export const sidebarCopy = {
  newGeneration: "New generation",
  studio: "Studio",
  navigation: "Navigation",
  closeNavigation: "Close navigation",
  accountMenu: "Account menu",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
};

export type NavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryLinks: NavLink[] = [
  { label: "Create", href: "/create/video", icon: Film },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Library", href: "/library", icon: Layers },
  { label: "Assets", href: "/assets", icon: FolderOpen },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

export const secondaryLinks: NavLink[] = [
  { label: "Pricing", href: "/pricing", icon: Coins },
  { label: "Help", href: "/help", icon: CircleHelp },
];

// One set of account entries, shared by the desktop menu and the drawer panel,
// so billing and settings appear in exactly one place.
export const accountLinks: NavLink[] = [
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Account settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: CircleHelp },
];
