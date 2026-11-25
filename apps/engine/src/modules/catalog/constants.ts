export const GENERATION_MODES = ["video", "image"] as const;

export const MODEL_INPUT_KINDS = ["image", "video", "audio"] as const;

export const PROVIDER_COST_UNITS = ["per_second", "per_image"] as const;

export const DEFAULT_PROVIDER_COST_UNIT = PROVIDER_COST_UNITS[1];
