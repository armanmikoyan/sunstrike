import { wallColumns } from "./constants";
import { VideoWallTile } from "./video-wall-tile";

export function VideoWall() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <div className="flex w-full min-w-[45rem] gap-2 px-2">
          {wallColumns.map((column, columnIndex) => (
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
