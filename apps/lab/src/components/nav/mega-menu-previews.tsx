import Image from "next/image";
import Link from "next/link";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { mediaById } from "@/mocks/media";
import { cn } from "cn";
import type { MegaMenuPreviewsProps } from "./types";

export function MegaMenuPreviews({ previews, onClose }: MegaMenuPreviewsProps) {
  return (
    <div className="hidden p-3 lg:block">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
        {previews.map((id, index) => {
          const item = mediaById(id);
          if (!item) return null;
          return (
            <Link
              key={id}
              href="/explore"
              onClick={onClose}
              className={cn("group relative overflow-hidden rounded-xl bg-secondary", index === 0 && "row-span-2")}
            >
              <Image
                src={item.poster}
                alt={item.title}
                fill
                sizes="180px"
                className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-transparent opacity-80" />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <p className="text-xs lg:text-[0.6875rem] font-medium text-white">{item.title}</p>
                <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-white/65">{item.model}</p>
              </div>
              <MediaKindBadge kind={item.kind} className="absolute right-2 top-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
