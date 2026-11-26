import type { OutputFile } from "@/modules/media";

/** What a provider needs to render one generation. */
export interface ProviderJob {
  generationId: string;
  modelId: string;
  prompt: string | null;
  settings: {
    mode: string;
    resolution: string;
    aspectRatio: string;
    durationSeconds: number | null;
    audio: boolean;
  };
  inputs: { assetId: string; role: string }[];
}

/** The file a provider rendered, or why it could not; a retryable failure is tried again. */
export type ProviderResult = { ok: true; output: OutputFile } | { ok: false; code: string; retryable: boolean };

export interface GenerationProvider {
  name: string;
  run(job: ProviderJob): Promise<ProviderResult>;
}
