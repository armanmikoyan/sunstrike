import { CircleHelp, Compass, Film, FolderOpen, Heart, Layers, Settings } from "lucide-react";
import { PricingIcon } from "./pricing-icon";
import type { NavLink } from "./types";

export const EXIT_MS = 260;

export const CTA_BEVEL = "inset 0 -0.1875rem 0 0 rgba(0, 0, 0, 0.43)";

export const ACCOUNT_MENU_CLOSE_DELAY_MS = 160;

export const ACCOUNT_PANE_ITEM_CLASS =
  "flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:text-[0.6875rem]";

export const AVATAR_PLACEHOLDER_CLASS = "size-7 shrink-0 rounded-full bg-secondary ring-1 ring-white/10";
export const AVATAR_FRAME_CLASS =
  "size-7 shrink-0 rounded-full border border-brand-secondary/80 shadow-[0_0_0_1px_rgba(167,139,250,0.18),0_0_12px_rgba(167,139,250,0.22)]";

export const ACCOUNT_MENU_COPY = {
  account: "Account",
  balance: "Balance",
  login: "Log in",
  signOut: "Sign out",
  signedOut: "Not signed in",
};

export const SIDEBAR_COPY = {
  newGeneration: "New generation",
  studio: "Studio",
  navigation: "Navigation",
  closeNavigation: "Close navigation",
  accountMenu: "Account menu",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
};

export const PRIMARY_LINKS: NavLink[] = [
  { label: "Create", href: "/create/video", icon: Film },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Library", href: "/library", icon: Layers },
  { label: "Assets", href: "/assets", icon: FolderOpen },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

export const SECONDARY_LINKS: NavLink[] = [
  {
    label: "Pricing",
    href: "/pricing",
    icon: PricingIcon,
    iconClassName: "transition-[filter] duration-200 group-hover:brightness-[1.2] motion-reduce:transition-none",
  },
  { label: "Help", href: "/help", icon: CircleHelp },
];

export const ACCOUNT_LINKS: NavLink[] = [{ label: "Settings", href: "/settings/account", icon: Settings }];
