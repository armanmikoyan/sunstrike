import type { ElementType, ReactElement, RefObject } from "react";

export type SidebarItemProps = {
  label: string;
  href: string;
  icon: ElementType;
  iconClassName?: string;
  active: boolean;
  expanded: boolean;
  /** Desktop rail (fixed 200px). The drawer lays items out full width. */
  rail: boolean;
  onNavigate?: () => void;
  onHover?: (item: HTMLElement) => void;
};

export type RailTooltipProps = {
  expanded: boolean;
  label: string;
  children: ReactElement;
};

export type AccountMenuProps = {
  side: "top" | "right";
  align: "start" | "end";
  email: string | null;
  avatarUrl?: string | null;
  onSignOut: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  pending?: boolean;
};

export type AccountAvatarProps = {
  avatarUrl?: string | null;
};

export type SidebarProps = Pick<SidebarToggleProps, "expanded" | "onToggle">;

export type SidebarBodyProps = SidebarProps & {
  showToggle?: boolean;
  onNavigate?: () => void;
  /** Drawer only: the account pane expands inline over the footer links. */
  inlineAccount?: boolean;
};

export type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
};

export type NavLink = Pick<SidebarItemProps, "label" | "href" | "icon" | "iconClassName">;

export type PricingIconProps = {
  className?: string;
  strokeWidth?: number;
};

export type SidebarExpandedState = {
  expanded: boolean;
  showToggle: boolean;
};

export type SidebarToggleProps = SidebarExpandedState & {
  onToggle: () => void;
};

export type SidebarNewGenerationProps = SidebarExpandedState & {
  onNavigate?: () => void;
};

export type SidebarLinksProps = {
  links: NavLink[];
  expanded: boolean;
  rail: boolean;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
};

export type SidebarInlineAccountProps = {
  onNavigate?: () => void;
};

export type SidebarAccountTriggerProps = SidebarExpandedState;

export type MobileSidebarPanelProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export type SidebarHoverIndicator = {
  y: number;
  width: number;
  visible: boolean;
  instant: boolean;
};
