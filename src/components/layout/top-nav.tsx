"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Ref } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Blocks,
  Camera,
  ChevronDown,
  CircleUserRound,
  Clapperboard,
  Coins,
  CreditCard,
  Disc3,
  Film,
  ImageIcon,
  Layers3,
  Maximize2,
  Palette,
  PanelLeft,
  Plus,
  Search,
  Shapes,
  X,
  WandSparkles,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mediaById } from "@/lib/media";
import { cn } from "@/lib/utils";

type MenuFeature = {
  name: string;
  description: string;
  href: string;
  icon: typeof Film;
};

type MegaMenu = {
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

const megaMenus: MegaMenu[] = [
  {
    key: "image",
    label: "Image",
    eyebrow: "Still generation",
    title: "Stills with a point of view",
    description:
      "Art-direct a frame with references, precise ratios and production-ready detail.",
    href: "/create/image",
    cta: "Open image studio",
    features: [
      {
        name: "Text to image",
        description: "Describe the frame. Get four directions.",
        href: "/create/image",
        icon: ImageIcon,
      },
      {
        name: "Reference mix",
        description: "Blend style, character and composition.",
        href: "/create/image",
        icon: Blocks,
      },
      {
        name: "Character",
        description: "Keep a face consistent across a series.",
        href: "/create/image",
        icon: CircleUserRound,
      },
      {
        name: "Product shot",
        description: "Studio scenes with accurate materials.",
        href: "/create/image",
        icon: Camera,
      },
      {
        name: "Relight",
        description: "Change the light, keep the subject.",
        href: "/create/image",
        icon: WandSparkles,
      },
      {
        name: "Upscale",
        description: "Print-ready detail up to 4x.",
        href: "/create/image",
        icon: Maximize2,
      },
    ],
    previews: ["05", "17", "10", "15"],
  },
  {
    key: "video",
    label: "Video",
    eyebrow: "Motion generation",
    title: "Shots that hold up in the edit",
    description:
      "Generate cinematic motion from a still or a prompt, then keep the good takes.",
    href: "/create/video",
    cta: "Open video studio",
    features: [
      {
        name: "Text to video",
        description: "A complete shot from a written direction.",
        href: "/create/video",
        icon: Film,
      },
      {
        name: "Image to video",
        description: "Bring a still into motion with camera cues.",
        href: "/create/video",
        icon: ImageIcon,
      },
      {
        name: "Camera control",
        description: "Push, orbit, crane and rack focus.",
        href: "/create/video",
        icon: Clapperboard,
      },
      {
        name: "Motion transfer",
        description: "Apply movement from a reference clip.",
        href: "/create/video",
        icon: Disc3,
      },
      {
        name: "Loop builder",
        description: "4 to 12 second loops",
        href: "/create/video",
        icon: Shapes,
      },
      {
        name: "Upscale",
        description: "Clean detail and extend to 4K.",
        href: "/create/video",
        icon: Maximize2,
      },
    ],
    previews: ["09", "14", "16", "02"],
  },
  {
    key: "motion",
    label: "Motion",
    eyebrow: "Camera & performance",
    title: "Direct the movement",
    description:
      "Guide the camera and performance without rebuilding the whole frame.",
    href: "/create/video",
    cta: "Open motion tools",
    features: [
      {
        name: "Camera path",
        description: "Draw a move through a scene.",
        href: "/create/video",
        icon: Clapperboard,
      },
      {
        name: "Face transfer",
        description: "Map a performance onto a character.",
        href: "/create/video",
        icon: CircleUserRound,
      },
      {
        name: "Lip sync",
        description: "Match dialogue in 28 languages.",
        href: "/create/video",
        icon: Disc3,
      },
      {
        name: "Re-speed",
        description: "Retime a shot with natural motion blur.",
        href: "/create/video",
        icon: Film,
      },
      {
        name: "Extend",
        description: "Continue a shot beyond its last frame.",
        href: "/create/video",
        icon: ArrowRight,
      },
      {
        name: "Style transfer",
        description: "Move a grade across a sequence.",
        href: "/create/video",
        icon: Palette,
      },
    ],
    previews: ["03", "07", "08", "11"],
  },
  {
    key: "edit",
    label: "Edit",
    eyebrow: "Post generation",
    title: "Finish the frame",
    description:
      "Small, surgical changes without another full generation. Every edit is priced up front.",
    href: "/create/image",
    cta: "Open edit tools",
    features: [
      {
        name: "Inpaint",
        description: "Remove, replace or rebuild a detail.",
        href: "/create/image",
        icon: WandSparkles,
      },
      {
        name: "Outpaint",
        description: "Expand a frame in any direction.",
        href: "/create/image",
        icon: Maximize2,
      },
      {
        name: "Color grade",
        description: "Match a look across every take.",
        href: "/create/image",
        icon: Palette,
      },
      {
        name: "Remove background",
        description: "Clean production-ready cutouts.",
        href: "/create/image",
        icon: Layers3,
      },
    ],
    previews: ["04", "18", "01", "12"],
  },
];

function MegaMenuPanel({
  menu,
  onClose,
  left,
}: {
  menu: MegaMenu;
  onClose: () => void;
  left: number;
}) {
  return (
    <div
      className="absolute top-12 z-50 w-[min(1120px,calc(100vw-2rem))]"
      style={{ left }}
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1e20] shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="grid min-h-[342px] lg:grid-cols-[250px_1fr_300px]">
          <div className="flex flex-col justify-between border-b border-white/[0.07] p-6 lg:border-b-0 lg:border-r">
            <div>
              <div className="mb-4 text-[12px] text-muted-foreground">
                {menu.eyebrow}
              </div>
              <h2 className="max-w-[220px] text-[25px] font-medium leading-[1.1] tracking-[-0.03em]">
                {menu.title}
              </h2>
              <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-muted-foreground">
                {menu.description}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-6 w-fit rounded-lg border-white/10 bg-white/[0.035] text-[12px] hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
            >
              <Link href={menu.href} onClick={onClose}>
                {menu.cta}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-white/[0.07] p-4 sm:grid-cols-2 lg:border-b-0 lg:border-r">
            {menu.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.045]"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-muted-foreground transition-colors group-hover:bg-white/[0.06] group-hover:text-foreground">
                    <Icon className="size-[15px]" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-[13px] font-medium text-foreground">
                      {feature.name}
                      <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-muted-foreground">
                      {feature.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="hidden p-3 lg:block">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
              {menu.previews.map((id, index) => {
                const item = mediaById(id);
                if (!item) return null;
                return (
                  <Link
                    key={id}
                    href="/explore"
                    onClick={onClose}
                    className={cn(
                      "group relative overflow-hidden rounded-xl bg-secondary",
                      index === 0 && "row-span-2",
                    )}
                  >
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="180px"
                      className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p className="text-[11px] font-medium text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/65">
                        {item.model}
                      </p>
                    </div>
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/15 bg-black/45 px-1.5 py-0.5 text-[11px] text-white/80 backdrop-blur">
                      {item.kind === "video" ? (
                        <Film className="size-3" />
                      ) : (
                        <ImageIcon className="size-3" />
                      )}
                      {item.kind === "video" ? "Video" : "Image"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] bg-white/[0.015] px-6 py-3">
          <p className="text-[11px] text-muted-foreground">
            Every render shows its price before you start.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              onClick={onClose}
              className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Recent renders
            </Link>
            <Link
              href="/pricing"
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pay as you go
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const NARROW_QUERY = "(max-width: 767px)";

/** Nothing to subscribe to: the platform never changes during a session. */
const subscribeNothing = () => () => {};

const getShortcut = () =>
  /Mac|iPhone|iPad/.test(navigator.userAgent) ? "\u2318 K" : "Ctrl K";

const getShortcutOnServer = () => "Ctrl K";

const subscribeNarrow = (onChange: () => void) => {
  const media = window.matchMedia(NARROW_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const getNarrow = () => window.matchMedia(NARROW_QUERY).matches;

const getNarrowOnServer = () => false;

export function TopNav({
  onOpenMenu,
  menuButtonRef,
}: {
  onOpenMenu: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  // Read from the browser instead of setting state in an effect: the server
  // snapshot keeps hydration quiet, the client snapshot swaps in after mount.
  const shortcut = useSyncExternalStore(
    subscribeNothing,
    getShortcut,
    getShortcutOnServer,
  );
  const compact = useSyncExternalStore(
    subscribeNarrow,
    getNarrow,
    getNarrowOnServer,
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState(0);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeMenu = megaMenus.find((menu) => menu.key === openMenu) ?? null;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const open = (key: string) => {
    cancelClose();

    const trigger = itemRefs.current[key];
    const header = trigger?.closest("header");
    if (trigger && header) {
      const panelWidth = Math.min(1000, window.innerWidth - 32);
      const offset =
        trigger.getBoundingClientRect().left -
        header.getBoundingClientRect().left;
      setPanelLeft(
        Math.max(8, Math.min(offset, window.innerWidth - panelWidth - 16)),
      );
    }

    setOpenMenu(key);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 110);
  };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => {
      window.removeEventListener("keydown", focusSearch);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 h-12 border-b border-border bg-background/90 backdrop-blur-xl"
      onMouseLeave={scheduleClose}
    >
      <div className="flex h-full w-full items-center gap-2 pl-3 pr-2 sm:pl-5">
        <button
          type="button"
          ref={menuButtonRef}
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="-ml-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:hidden"
        >
          <PanelLeft className="size-[18px]" strokeWidth={1.8} />
        </button>
        <Link
          href="/"
          aria-label="Sunstrike.ai home"
          className="shrink-0"
        >
          <LogoMark className="size-9 sm:size-10" />
        </Link>

        <nav
          aria-label="Studio tools"
          className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex"
          onMouseLeave={scheduleClose}
        >
          {megaMenus.map((menu) => {
            const active = openMenu === menu.key;
            return (
              <div
                key={menu.key}
                ref={(node) => {
                  itemRefs.current[menu.key] = node;
                }}
                className="shrink-0"
                onMouseEnter={() => open(menu.key)}
              >
                <Link
                  href={menu.href}
                  onFocus={() => open(menu.key)}
                  onClick={() => setOpenMenu(null)}
                  aria-expanded={active}
                  className={cn(
                    "flex h-9 items-center gap-1 rounded-lg px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
                    active && "bg-white/[0.055] text-foreground",
                  )}
                >
                  {menu.label}
                  <ChevronDown
                    className={cn(
                      "size-3 opacity-45 transition-transform",
                      active && "rotate-180 opacity-70",
                    )}
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 lg:flex-none">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const term = query.trim();
              router.push(
                term ? `/explore?q=${encodeURIComponent(term)}` : "/explore",
              );
            }}
            role="search"
            className="group relative flex h-9 min-w-0 flex-1 items-center md:w-[180px] md:flex-none lg:w-[240px] xl:w-[300px]"
          >
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder={compact ? "Search" : "Search the studio"}
              aria-label="Search the studio"
              className={cn(
                "h-9 w-full appearance-none rounded-lg border border-white/[0.08] bg-white/[0.035] pl-8 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-white/25 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                query.length === 0 ? "pr-2.5 lg:pr-11" : "pr-9 lg:pr-11",
              )}
            />

            {/* One slot at the far right: the hotkey hint while empty,
                the clear affordance once there is something to clear. */}
            <div className="absolute inset-y-0 right-1.5 flex items-center">
              {query.length === 0 ? (
                <kbd
                  aria-hidden
                  className="pointer-events-none hidden items-center rounded border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground lg:flex"
                >
                  {shortcut}
                </kbd>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="grid size-[18px] place-items-center rounded-full bg-white/20 text-background transition-colors hover:bg-white/35"
                >
                  <X className="size-[11px]" strokeWidth={3} />
                </button>
              )}
            </div>
          </form>

          <Link
            href="/billing"
            className="group flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            <Coins className="hidden size-3.5 text-muted-foreground sm:block" />
            <span className="text-[12px] font-medium tabular-nums">$10.54</span>
            <span className="hidden text-[11px] text-muted-foreground lg:inline">
              balance
            </span>
            <span className="mx-0.5 hidden h-3.5 w-px bg-white/10 sm:block" />
            <Plus className="hidden size-3 text-muted-foreground transition-colors group-hover:text-foreground sm:block" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="size-[17px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-1.5">
              <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                Notifications
                <span className="text-[11px] font-normal text-foreground">
                  3 new
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="items-start gap-2.5 p-2">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-foreground">
                  <Film className="size-3.5" />
                </span>
                <span>
                  <span className="block text-[12px] font-medium">
                    Your render is ready
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    After Rain · 6 seconds · 1080p
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="items-start gap-2.5 p-2">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-muted-foreground">
                  <CreditCard className="size-3.5" />
                </span>
                <span>
                  <span className="block text-[12px] font-medium">
                    Balance added
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    $10.00 from your top-up
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="items-start gap-2.5 p-2">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-muted-foreground">
                  <Layers3 className="size-3.5" />
                </span>
                <span>
                  <span className="block text-[12px] font-medium">
                    New: Sunstrike Motion 2
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Better faces, longer shots.
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center text-[11px] text-muted-foreground">
                <Link href="/library">View all activity</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeMenu ? (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="hidden lg:block"
        >
          <MegaMenuPanel
            menu={activeMenu}
            onClose={() => setOpenMenu(null)}
            left={panelLeft}
          />
        </div>
      ) : null}
    </header>
  );
}
