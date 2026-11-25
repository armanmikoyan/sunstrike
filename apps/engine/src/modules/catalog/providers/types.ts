export interface ProviderSyncTarget {
  slug: string;
  name: string;
  summary: string;
  providerModelKey: string;
  providerCostMicros: number;
  active: boolean;
}

/** Upstream capabilities as reported; the catalog keeps only values it recognises. */
export interface ProviderCapabilities {
  modes: string[];
  inputs: string[];
  resolutions: string[];
  durationsSeconds: number[];
  aspectRatios: string[];
  audio: boolean;
}

export interface ProviderCost {
  micros: number;
  unit: string;
}

export interface ProviderVendor {
  id: string;
  name: string;
  logoUrl: string | null;
}

/** Upstream facts for one model; `null` keeps the catalog's current value. */
export interface ProviderSyncUpdate {
  providerModelKey: string;
  active: boolean;
  capabilities: ProviderCapabilities | null;
  cost: ProviderCost | null;
  vendor: ProviderVendor | null;
}

/** Adapter contract for syncing upstream model availability, capabilities and cost. */
export interface CatalogProviderAdapter {
  readonly provider: string;
  fetchModelUpdates(targets: readonly ProviderSyncTarget[]): Promise<ProviderSyncUpdate[]>;
}
