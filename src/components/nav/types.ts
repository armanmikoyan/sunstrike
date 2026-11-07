import type { Ref } from "react";
import type { LucideIcon } from "lucide-react";

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

export type MegaMenuPanelProps = {
  menu: MegaMenu;
  onClose: () => void;
  left: number;
  width: number;
};

export type TopNavProps = {
  onOpenMenu: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
};
