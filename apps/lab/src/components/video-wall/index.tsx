"use client";

import { WALL_COLUMNS } from "./constants";
import { useWallLive } from "./hooks";
import { VideoWallTile } from "./video-wall-tile";

export function VideoWall() {
  const live = useWallLive();

  return (
    // Decorative: every clip appears twice for the seamless loop, and the
    // gallery below lists the same work with real links.
    <div aria-hidden className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <div className="flex w-full min-w-180 gap-2 px-2">
          {WALL_COLUMNS.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="wall-column flex w-1/5 flex-col"
              style={{
                animationDuration: `${6.5 + columnIndex * 1.1}s`,
              }}
            >
              {[0, 1].map((repeat) => (
                <div key={repeat} className="wall-column-group">
                  {column.map((id, index) => (
                    <VideoWallTile
                      key={`${repeat}-${id}`}
                      id={id}
                      live={live}
                      preload={columnIndex === 0 && index === 0 ? "auto" : "none"}
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
