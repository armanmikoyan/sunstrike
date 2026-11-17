import type { ReactElement, RefObject } from "react";

export type SidebarItemProps = {
  label: string;
  href: string;
  icon: React.ElementType;
  iconClassName?: string;
  active: boolean;
  expanded: boolean;
  /** Desktop rail (fixed 200px). The drawer lays items out full width. */
  rail: boolean;
  onNavigate?: () => void;
};

export type RailTooltipProps = {
  expanded: boolean;
  label: string;
  children: ReactElement;
};

export type AccountMenuProps = {
  side: "top" | "right";
  align: "start" | "end";
};

export type SidebarBodyProps = {
  expanded: boolean;
  onToggle: () => void;
  showToggle?: boolean;
  onNavigate?: () => void;
  /** Drawer only: the account pane expands inline over the footer links. */
  inlineAccount?: boolean;
};

export type SidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

export type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
};
