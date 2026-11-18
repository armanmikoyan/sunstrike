import { Film, ImageIcon } from "lucide-react";
import { cn } from "cn";

type MediaKind = "video" | "image";

type MediaKindBadgeProps = {
  kind: MediaKind;
  label?: string;
  time?: string;
  iconOnly?: boolean;
  className?: string;
};

export function MediaKindBadge({ kind, label, time, iconOnly = false, className }: MediaKindBadgeProps) {
  const iconClass = iconOnly ? "size-2.5" : "size-3.5 shrink-0";
  const icon = kind === "video" ? <Film className={iconClass} /> : <ImageIcon className={iconClass} />;

  if (iconOnly) {
    return (
      <span className={cn("grid size-4 place-items-center rounded bg-black/35 text-white/80 backdrop-blur", className)}>
        {icon}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-xs leading-4 text-white/85 backdrop-blur-md lg:text-[0.6875rem]",
        className,
      )}
    >
      {icon}
      {label ?? (kind === "video" ? "Video" : "Image")}
      {time ? <span className="font-mono text-white/65">{time}</span> : null}
    </span>
  );
}
