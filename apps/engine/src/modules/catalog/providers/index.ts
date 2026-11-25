import type { CatalogProviderAdapter } from "./types";

const adapters = new Map<string, CatalogProviderAdapter>();

export function registerProviderAdapter(adapter: CatalogProviderAdapter): void {
  adapters.set(adapter.provider, adapter);
}

export function getProviderAdapter(provider: string): CatalogProviderAdapter | null {
  return adapters.get(provider) ?? null;
}

export function listProviderAdapters(): CatalogProviderAdapter[] {
  return [...adapters.values()];
}

export function clearProviderAdapters(): void {
  adapters.clear();
}
