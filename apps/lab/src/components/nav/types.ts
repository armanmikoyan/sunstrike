import type { Ref } from "react";
import type { LucideIcon } from "lucide-react";
import type { useMegaMenu } from "./hooks";

export type OnCloseProps = {
  onClose: () => void;
};

/** 02 Core entities — `notifications`. */
export type Notification = {
  id: string;
  generationId: string;
  type: string;
  readAt: string | null;
  createdAt: string;
};

export type MenuFeature = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type MegaMenu = {
  key: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  features: MenuFeature[];
  previews: string[];
};

export type MegaMenuCloseProps = {
  menu: MegaMenu;
  onClose: () => void;
};

export type MegaMenuPanelProps = MegaMenuCloseProps & {
  left: number;
  width: number;
};

export type TopNavProps = {
  onOpenMenu: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
};

export type MegaMenuIntroProps = MegaMenuCloseProps;

export type MegaMenuFeaturesProps = OnCloseProps & {
  features: MenuFeature[];
};

export type MegaMenuPreviewsProps = OnCloseProps & {
  previews: string[];
};

export type MegaMenuFooterProps = OnCloseProps;

export type MegaMenuControls = ReturnType<typeof useMegaMenu>;

export type NavMenuLinksProps = {
  menu: MegaMenuControls;
};
