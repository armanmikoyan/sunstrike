import Image from "next/image";
import { Film } from "lucide-react";
import { VideoWithFallback } from "@/components/media/video-with-fallback";
import { mediaById } from "@/lib/media";

const columns = [
  ["01", "11", "16"],
  ["02", "09", "17"],
  ["03", "10", "18"],
  ["04", "13", "15"],
  ["08", "05", "12"],
  ["07", "06", "14"],
];

function WallTile({
  id,
  preload,
}: {
  id: string;
  preload: "auto" | "metadata";
}) {
  const item = mediaById(id);
  if (!item) return null;

  return (
    <div
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-secondary sm:rounded-[18px]"
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
          <p className="truncate text-[11px] font-medium text-white sm:text-[12px]">
            {item.title}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/60">
            {item.model}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-md border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-white/80 backdrop-blur">
          <Film className="size-3" />
          {item.kind === "video" ? item.duration : "Still"}
        </span>
      </div>
    </div>
  );
}

export function VideoWall() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <div className="flex w-full min-w-[1080px] gap-2.5 px-2 sm:gap-3">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="wall-column flex w-1/6 flex-col"
              style={{
                animationDuration: `${9 + columnIndex * 1.4}s`,
              }}
            >
              {[0, 1].map((repeat) => (
                <div key={repeat} className="wall-column-group">
                  {column.map((id, index) => (
                    <WallTile
                      key={`${repeat}-${id}`}
                      id={id}
                      preload={
                        columnIndex < 2 && index === 0 ? "auto" : "metadata"
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(19,21,23,0.45)_0%,rgba(19,21,23,0)_14%,rgba(19,21,23,0)_74%,rgba(19,21,23,0.55)_92%,#131517_100%)]" />
    </div>
  );
}
