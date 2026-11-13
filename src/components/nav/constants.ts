import {
  ArrowRight,
  Blocks,
  Camera,
  CircleUserRound,
  Clapperboard,
  Disc3,
  Film,
  ImageIcon,
  Layers3,
  Maximize2,
  Palette,
  Shapes,
  WandSparkles,
} from "lucide-react";
import type { MegaMenu } from "./types";

export const megaMenus: MegaMenu[] = [
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

export const notificationsCopy = {
  label: "Notifications",
};

export const megaMenuCopy = {
  video: "Video",
  image: "Image",
  priceNote: "Every render shows its price before you start.",
  recentRenders: "Recent renders",
  payg: "Pay as you go",
};

export const navCopy = {
  home: "Chronolab.ai home",
  openNavigation: "Open navigation",
  tools: "Studio tools",
  search: "Search the studio",
  compactSearch: "Search",
  clearSearch: "Clear search",
};
