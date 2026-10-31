"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  Coins,
  Compass,
  CreditCard,
  FolderOpen,
  Heart,
  Layers,
  LogOut,
  Plus,
  Settings,
  Film,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoLockup } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const EXIT_MS = 260;

// The primary action borrows the built-in Higgsfield button: a soft radial
// fill, no border, and a dark line inset along the bottom edge so it reads as
// a physical, pressable key. Crimson stands in for their lime.
const CTA_FILL = "radial-gradient(in oklab, #e24855 40%, #d12b38 100%)";
const CTA_BEVEL = "inset 0 -3px 0 0 rgba(0, 0, 0, 0.43)";

const primaryLinks = [
  { label: "Create", href: "/create/video", icon: Film },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Library", href: "/library", icon: Layers },
  { label: "Assets", href: "/assets", icon: FolderOpen },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

const secondaryLinks = [
  { label: "Pricing", href: "/pricing", icon: Coins },
  { label: "Help", href: "/help", icon: CircleHelp },
];

// One set of account entries, shared by the desktop menu and the drawer panel,
// so billing and settings appear in exactly one place.
const accountLinks = [
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Account settings", href: "/settings", icon: Settings },
  { label: "Workspace", href: "/settings", icon: Layers },
  { label: "Help", href: "/help", icon: CircleHelp },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/create/video") return pathname.startsWith("/create");
    return pathname === href;
  };
}

function SidebarItem({
  label,
  href,
  icon: Icon,
  active,
  expanded,
  rail,
  onNavigate,
}: {
  label: string;
  href: string;
  icon: typeof Film;
  active: boolean;
  expanded: boolean;
  /** Desktop rail (fixed 200px). The drawer lays items out full width. */
  rail: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      aria-label={label}
      onClick={onNavigate}
      className={cn(
        // Width stays 100%; the cap animates from the 40px icon box to the
        // 180px content column (200px rail minus its 10px insets). Capping a
        // full-width box keeps its edge travelling in one direction — a
        // `w-10 → w-full` transition re-reads 100% every frame and bulges.
        "group relative flex h-10 w-full shrink-0 items-center gap-3 self-center overflow-hidden rounded-xl text-muted-foreground transition-[max-width,height,padding,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground motion-reduce:transition-none",
        expanded
          ? rail
            ? "max-w-[180px] pl-3 pr-2"
            : "max-w-full pl-3 pr-2"
          : "max-w-10 px-[11px]",
        active && "bg-secondary text-foreground",
      )}
    >
      {active ? (
        <span className="absolute left-0 h-4 w-[2px] rounded-full bg-foreground" />
      ) : null}
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      <span
        className={cn(
          "truncate text-[12px] font-medium transition-opacity duration-200 motion-reduce:transition-none",
          expanded ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </Link>
  );

  // The trigger stays mounted in both states so the rail can animate the link
  // instead of swapping it for a new element. Tooltips only exist while
  // collapsed, and the wrapper drops any hover state left over from the
  // expanded rail so collapsing cannot pop one the pointer never asked for.
  return (
    <RailTooltip expanded={expanded} label={label}>
      {link}
    </RailTooltip>
  );
}

/**
 * A tooltip for the icon-only rail. While the rail is expanded the content is
 * gone and the open state is forced closed, so a pointer that was resting on
 * an item during the collapse does not trigger a stale tooltip.
 */
function RailTooltip({
  expanded,
  label,
  children,
}: {
  expanded: boolean;
  label: string;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [lastExpanded, setLastExpanded] = useState(expanded);

  if (lastExpanded !== expanded) {
    setLastExpanded(expanded);
    setOpen(false);
  }

  return (
    <Tooltip
      open={open && !expanded}
      onOpenChange={(next) => setOpen(next && !expanded)}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {expanded ? null : (
        <TooltipContent side="right" sideOffset={14} className="font-medium">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function AccountMenu({
  side,
  align,
}: {
  side: "top" | "right";
  align: "start" | "end";
}) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={8}
      className="w-60 p-1.5"
    >
      <DropdownMenuLabel className="px-2 py-2">
        <span className="block text-[12px] font-medium text-foreground">
          Arman Mikoyan
        </span>
        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
          arman@sunstrike.ai
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="p-2">
        <Link href="/pricing">
          <Coins className="size-4 text-muted-foreground" />
          <span className="flex-1">Balance</span>
          <span className="font-mono text-[11px] tabular-nums text-foreground">
            $10.54
          </span>
          <Plus className="size-3.5 text-muted-foreground" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {accountLinks.map((item) => (
        <DropdownMenuItem key={item.label} asChild className="p-2">
          <Link href={item.href}>
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="p-2">
        <Link href="/login">
          <LogOut className="size-4 text-muted-foreground" />
          Sign out
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function SidebarBody({
  expanded,
  onToggle,
  showToggle = true,
  onNavigate,
  inlineAccount = false,
}: {
  expanded: boolean;
  onToggle: () => void;
  showToggle?: boolean;
  onNavigate?: () => void;
  inlineAccount?: boolean;
}) {
  const isActive = useIsActive();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div
      className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto overscroll-contain"
    >
      <div
        className={cn(
          // The header keeps a fixed height, so the rail's contents cannot jump
          // while the toggle's hit area animates between 40 and 32px.
          "relative mb-4 flex h-11 w-full shrink-0 items-center",
          expanded && !showToggle && "pr-9",
        )}
      >
        <LogoLockup
          compact
          inactive={!expanded}
          className={cn(
            "min-w-0 overflow-hidden transition-opacity duration-200 motion-reduce:transition-none",
            expanded
              ? "opacity-100"
              : "pointer-events-none absolute w-0 opacity-0",
          )}
        />
        {showToggle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                aria-expanded={expanded}
                className={cn(
                  // The toggle is the one control that moves from the rail's
                  // centre to its edge, so its offset has to animate with the
                  // rail instead of being re-aligned by the flex row (that made
                  // it teleport across the whole panel on collapse).
                  "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-[right,translate,width,height,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground motion-reduce:transition-none",
                  expanded
                    ? "right-0 size-8 translate-x-0"
                    : "right-1/2 size-10 translate-x-1/2",
                )}
              >
                {expanded ? (
                  <PanelLeftClose className="size-4" strokeWidth={1.8} />
                ) : (
                  <PanelLeftOpen className="size-4" strokeWidth={1.8} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>
              {expanded ? "Collapse sidebar" : "Expand sidebar"}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      <RailTooltip expanded={expanded} label="New generation">
        <Link
          href="/create/video"
          onClick={onNavigate}
          aria-label="New generation"
          className={cn(
            "group relative mb-5 flex h-10 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl text-[13px] font-semibold text-brand-foreground transition-[max-width,padding,opacity,transform] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-80 active:scale-[0.97] motion-reduce:transition-none",
            expanded
              ? showToggle
                ? "max-w-[180px] px-3"
                : "max-w-full px-3"
              : "max-w-10 px-[10px]",
          )}
          style={{ backgroundImage: CTA_FILL, boxShadow: CTA_BEVEL }}
        >
          <Plus className="size-5 shrink-0" strokeWidth={2.2} />
          <span
            className={cn(
              "truncate transition-opacity duration-200 motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            New generation
          </span>
        </Link>
      </RailTooltip>

      <nav
        aria-label="Studio"
        className="flex w-full shrink-0 flex-col gap-1.5"
      >
        {primaryLinks.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            expanded={expanded}
            rail={showToggle}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-1.5 pt-4">
        {inlineAccount ? null : (
          <>
            {secondaryLinks.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                expanded={expanded}
                rail={showToggle}
                active={isActive(item.href)}
                onNavigate={onNavigate}
              />
            ))}

            <div
              className={cn(
                "my-2 h-px w-full max-w-7 self-center bg-border transition-[max-width] duration-[260ms] motion-reduce:transition-none",
                expanded
                  ? showToggle
                    ? "max-w-[180px]"
                    : "max-w-full"
                  : "max-w-7",
              )}
            />
          </>
        )}

        {expanded && inlineAccount ? (
          <div className="flex w-full flex-col">
            {accountOpen ? (
              <div className="mb-1.5 flex flex-col gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5">
                <Link
                  href="/pricing"
                  onClick={onNavigate}
                  className="flex h-9 items-center gap-2 rounded-lg px-2 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                >
                  <Coins className="size-3.5" />
                  Balance
                  <span className="ml-auto font-mono tabular-nums text-foreground">
                    $10.54
                  </span>
                  <Plus className="size-3.5" />
                </Link>
                {accountLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex h-9 items-center gap-2 rounded-lg px-2 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg px-2 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </button>
              </div>
            ) : null}

            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((value) => !value)}
              className="flex h-11 w-full items-center gap-2.5 rounded-xl px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-medium text-foreground ring-1 ring-white/10">
                AM
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-foreground">
                  Arman Mikoyan
                </span>
                <span className="block truncate text-[11px]">
                  arman@sunstrike.ai
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200",
                  accountOpen && "rotate-180",
                )}
              />
            </button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className={cn(
                  "flex w-full shrink-0 items-center self-center overflow-hidden rounded-xl text-left text-muted-foreground outline-none transition-[max-width,height,padding,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-white/25 motion-reduce:transition-none",
                  expanded
                    ? showToggle
                      ? "h-10 max-w-[180px] gap-2.5 px-2"
                      : "h-10 max-w-full gap-2.5 px-2"
                    : "h-10 max-w-10 gap-0 pl-[6px]",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-medium text-foreground ring-1 ring-white/10">
                  AM
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
                    expanded ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="block truncate text-[12px] font-medium text-foreground">
                    Arman Mikoyan
                  </span>
                  <span className="block truncate text-[11px]">
                    arman@sunstrike.ai
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <AccountMenu
              side={expanded ? "top" : "right"}
              align={expanded ? "start" : "end"}
            />
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export function Sidebar({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        // The inset is identical in both states; the gutter around the icons
        // comes from the rail width, not from padding. Collapsed, the rail is
        // the 40px control plus the same 10px inset the open rail uses (and its
        // 1px border), so controls keep one vertical axis and never slide.
        "sticky top-0 z-50 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar px-2.5 py-2.5 transition-[width] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:flex",
        expanded ? "w-[200px]" : "w-[61px]",
      )}
    >
      <SidebarBody expanded={expanded} onToggle={onToggle} />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const lastPathname = useRef(pathname);
  const [rendered, setRendered] = useState(open);

  // Mount during render when it opens: that keeps the panel in the same commit
  // as the trigger, so the opening keyframes are never skipped.
  if (open && !rendered) {
    setRendered(true);
  }

  // Stay mounted through the exit animation, then drop the panel.
  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Explicit keyframes: they always start from off-screen, so the motion is
  // never collapsed into the first paint the way a CSS transition can be.
  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = {
      duration: reduce ? 140 : 260,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      fill: "both" as const,
    };

    panel.animate(
      open
        ? [{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }]
        : [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }],
      timing,
    );
    overlay.animate(
      open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
      timing,
    );
  }, [open, rendered]);

  // Close only when the route actually changes, not on mount or when the
  // parent hands us a fresh callback.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const query = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (query.matches) onOpenChange(false);
    };

    closeOnDesktop();
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (rendered) panelRef.current?.focus();
  }, [rendered]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    const focusTarget = returnFocusRef?.current;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      focusTarget?.focus();
    };
  }, [open, onOpenChange, returnFocusRef]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        ref={overlayRef}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 size-full cursor-default bg-black/65"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        tabIndex={-1}
        className="absolute inset-y-0 left-0 flex w-[80%] max-w-[440px] transform-gpu flex-col rounded-r-2xl border-r border-white/[0.07] bg-sidebar outline-none will-change-transform"
        style={{ height: "100dvh" }}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close navigation"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <PanelLeftClose className="size-[18px]" strokeWidth={1.8} />
        </button>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5">
          <SidebarBody
            expanded
            showToggle={false}
            inlineAccount
            onToggle={() => onOpenChange(false)}
            onNavigate={() => onOpenChange(false)}
          />
        </div>
      </div>
    </div>
  );
}
