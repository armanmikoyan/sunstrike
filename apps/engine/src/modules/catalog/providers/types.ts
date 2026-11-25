export interface ProviderSyncTarget {
  slug: string;
  name: string;
  summary: string;
  providerModelKey: string;
  providerCostMicros: number;
  active: boolean;
}

export interface ProviderSyncUpdate {
  providerModelKey: string;
  name: string;
  providerCostMicros: number;
  active: boolean;
}

/** Adapter contract for syncing upstream model availability and cost metadata. */
export interface CatalogProviderAdapter {
  readonly provider: string;
  fetchModelUpdates(targets: readonly ProviderSyncTarget[]): Promise<ProviderSyncUpdate[]>;
}
