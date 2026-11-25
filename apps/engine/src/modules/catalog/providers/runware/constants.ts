export const RUNWARE_PROVIDER = "runware";

export const RUNWARE_API_URL = "https://api.runware.ai/v1";

/** Public index of every Runware model, each linking to its published schema. */
export const RUNWARE_MODEL_INDEX_URL = "https://runware.ai/docs/models/index.json";

export const RUNWARE_TIMEOUT_MS = 15_000;

export const RUNWARE_SEARCH_LIMIT = 5;

export const RUNWARE_LIVE_STATUS = "live";

export const RUNWARE_AUDIO_CAPABILITY = "audio";

export const MICROS_PER_USD = 1_000_000;

export const RUNWARE_MODES: Readonly<Record<string, string>> = {
  "text-to-video": "video",
  "image-to-video": "video",
  "video-to-video": "video",
  "audio-to-video": "video",
  "text-to-image": "image",
  "image-to-image": "image",
};

export const RUNWARE_COST_UNITS: Readonly<Record<string, string>> = {
  durationSecond: "per_second",
  output: "per_image",
};

export const RUNWARE_INPUT_KINDS: ReadonlyArray<readonly [string, RegExp]> = [
  ["image", /image/i],
  ["video", /video/i],
  ["audio", /audio/i],
];

/** Size presets are titled "<resolution> (<aspect ratio>)", such as "720p (16:9)". */
export const RUNWARE_PRESET_TITLE = /^(.+?) \((\d+:\d+)\)$/;
