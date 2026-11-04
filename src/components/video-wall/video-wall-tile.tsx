import Image from "next/image";
import { Film } from "lucide-react";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/lib/media";
import type { ComponentProps } from "react";

export function VideoWallTile({
  id,
  preload,
}: {
  id: string;
  preload: ComponentProps<"video">["preload"];
}) {
  const item = mediaById(id);
  if (!item) return null;

  return (
    <div
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-[0.875rem] bg-secondary sm:rounded-[1.125rem]"
      style={{
        backgroundImage: `url(${item.poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {item.kind === "video" ? (
        <VideoWithFallback
          src={item.src}
          poster={item.poster}
          fallback={item.fallback}
          preload={preload}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image
          src={item.poster}
          alt={item.title}
          fill
          sizes="18vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:p-4">
        <div className="min-w-0">
          <p className="truncate text-[0.6875rem] font-medium text-white sm:text-[0.75rem]">
            {item.title}
          </p>
          <p className="mt-0.5 truncate text-[0.6875rem] text-white/60">
            {item.model}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-md border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[0.6875rem] text-white/80 backdrop-blur">
          <Film className="size-3" />
          {item.kind === "video" ? item.duration : "Still"}
        </span>
      </div>
    </div>
  );
}
