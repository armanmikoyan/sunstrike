export interface RunwareIndexEntry {
  id: string;
  air: string;
  status: string;
  schema: string;
}

export interface RunwareProperty {
  type?: string;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  properties?: Record<string, RunwareProperty>;
}

export interface RunwareTaskSchema {
  properties?: Record<string, RunwareProperty>;
  allOf?: unknown[];
}

export interface RunwareRate {
  amount: number;
  unit: string;
  label?: string;
}

/** The parts of a model's published OpenAPI document the catalog reads. */
export interface RunwareModelSchema {
  info: {
    "x-air-id": string;
    "x-status": string;
    "x-capabilities": string[];
    "x-creator"?: { id: string; name: string; logo?: string };
    "x-pricing"?: { currency: string; rates: RunwareRate[] };
  };
  components: { schemas: { RequestBody: { items: RunwareTaskSchema } } };
}

export interface RunwareSizePreset {
  resolution: string;
  aspectRatio: string;
}

export interface RunwareCapabilities {
  modes: string[];
  inputs: string[];
  resolutions: string[];
  durationsSeconds: number[];
  aspectRatios: string[];
  audio: boolean;
}

export interface RunwareCost {
  micros: number;
  unit: string;
}

export interface RunwareVendor {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface RunwareModelUpdate {
  providerModelKey: string;
  active: boolean;
  capabilities: RunwareCapabilities | null;
  cost: RunwareCost | null;
  vendor: RunwareVendor | null;
}

export interface RunwareSearchResponse {
  data?: { results?: { air: string }[] }[];
  errors?: { message?: string }[];
}
