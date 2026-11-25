import { randomUUID } from "node:crypto";
import { config } from "@/infra/config";
import { httpError } from "@/shared/utils";
import {
  RUNWARE_API_URL,
  RUNWARE_MODEL_INDEX_URL,
  RUNWARE_PROVIDER,
  RUNWARE_SEARCH_LIMIT,
  RUNWARE_TIMEOUT_MS,
} from "./constants";
import type { RunwareIndexEntry, RunwareModelSchema, RunwareModelUpdate, RunwareSearchResponse } from "./types";
import { toSyncUpdate } from "./utils";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(RUNWARE_TIMEOUT_MS) });

  if (!response.ok) throw httpError(502, `Runware request failed with ${response.status}.`);

  return (await response.json()) as T;
}

async function fetchModelIndex(): Promise<Map<string, RunwareIndexEntry>> {
  const entries = await requestJson<RunwareIndexEntry[]>(RUNWARE_MODEL_INDEX_URL);

  return new Map(entries.map((entry) => [entry.air, entry]));
}

/** Whether the model is served to this account, through the authenticated model search. */
async function isAvailable(air: string): Promise<boolean> {
  const body = await requestJson<RunwareSearchResponse>(RUNWARE_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${config.runwareApiKey()}` },
    body: JSON.stringify([
      { taskType: "modelSearch", taskUUID: randomUUID(), search: air, limit: RUNWARE_SEARCH_LIMIT },
    ]),
  });

  if (body.errors?.length) throw httpError(502, body.errors[0]?.message ?? "Runware model search failed.");

  return (body.data?.[0]?.results ?? []).some((result) => result.air === air);
}

export const runwareAdapter = {
  provider: RUNWARE_PROVIDER,
  async fetchModelUpdates(targets: readonly { providerModelKey: string }[]): Promise<RunwareModelUpdate[]> {
    const index = await fetchModelIndex();
    const updates: RunwareModelUpdate[] = [];

    for (const { providerModelKey } of targets) {
      const entry = index.get(providerModelKey);
      const available = await isAvailable(providerModelKey);
      const schema = available && entry ? await requestJson<RunwareModelSchema>(entry.schema) : null;

      updates.push(toSyncUpdate(providerModelKey, schema));
    }

    return updates;
  },
};
