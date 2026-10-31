import type { GenerationMode } from "@/lib/store";

export const modelOptions: Record<
  GenerationMode,
  { name: string; tag: string; cost: number; description: string }[]
> = {
  video: [
    {
      name: "Sunstrike Motion 2",
      tag: "Cinematic",
      cost: 0.51,
      description: "Best detail · native audio",
    },
    {
      name: "Sunstrike Motion Turbo",
      tag: "Fast",
      cost: 0.34,
      description: "4s drafts · 3x faster",
    },
    {
      name: "Sunstrike Camera",
      tag: "Direction",
      cost: 0.6,
      description: "Camera paths · longer takes",
    },
    {
      name: "Sunstrike Loop",
      tag: "Loop",
      cost: 0.43,
      description: "Seamless motion · 4–12s",
    },
  ],
  image: [
    {
      name: "Sunstrike Image 2",
      tag: "Balanced",
      cost: 0.07,
      description: "Fast iteration · 1 MP",
    },
    {
      name: "Sunstrike Image Pro",
      tag: "Detail",
      cost: 0.12,
      description: "Best type & texture · 2 MP",
    },
    {
      name: "Sunstrike Image Raw",
      tag: "Raw",
      cost: 0.17,
      description: "Neutral grade · 4 MP",
    },
    {
      name: "Sunstrike Product",
      tag: "Product",
      cost: 0.1,
      description: "Materials & product accuracy",
    },
  ],
};

export const aspectRatios = [
  { value: "16:9", label: "Landscape", shape: "h-[9px] w-4" },
  { value: "9:16", label: "Portrait", shape: "h-4 w-[9px]" },
  { value: "1:1", label: "Square", shape: "size-3" },
  { value: "4:3", label: "Classic", shape: "h-3 w-4" },
  { value: "3:4", label: "Editorial", shape: "h-4 w-3" },
  { value: "21:9", label: "Cinema", shape: "h-[7px] w-[18px]" },
];

export const durations = ["4s", "5s", "6s", "8s", "12s"];

export function getGenerationCost(
  mode: GenerationMode,
  modelName: string,
  duration: string,
) {
  const models = modelOptions[mode];
  const model = models.find((item) => item.name === modelName) ?? models[0];
  if (mode === "video") {
    // Longer takes add time-based render cost on top of the base clip rate.
    const durationExtra = duration === "12s" ? 0.43 : duration === "8s" ? 0.17 : 0;
    return Math.round((model.cost + durationExtra) * 100) / 100;
  }
  return model.cost;
}
