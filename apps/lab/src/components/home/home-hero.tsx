import { PromptComposer } from "@/components/prompt-composer";
import { VideoWall } from "@/components/video-wall";

export function HomeHero() {
  return (
    <section className="relative h-[calc(100svh-3rem)] min-h-130 overflow-hidden">
      <VideoWall />
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 md:pb-5">
        <PromptComposer className="mx-auto max-w-190 text-left" />
      </div>
    </section>
  );
}
