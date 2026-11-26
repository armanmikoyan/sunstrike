import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/infra/config";
import type { SignedUpload, StoredObject } from "./types";
import { clientOptions, storageError } from "./utils";

let client: SupabaseClient | undefined;

/** Private Storage through the secret key; callers authorise before every call. */
function getClient(): SupabaseClient {
  client ??= createClient(config.supabaseUrl(), config.supabaseSecretKey(), clientOptions());

  return client;
}

export async function createUploadUrl(bucket: string, path: string): Promise<SignedUpload> {
  const { data, error } = await getClient().storage.from(bucket).createSignedUploadUrl(path, { upsert: false });

  if (error) throw storageError("sign an upload", error);

  return { url: data.signedUrl, token: data.token };
}

export async function statObject(bucket: string, path: string): Promise<StoredObject | null> {
  const files = getClient().storage.from(bucket);
  const { data: found } = await files.exists(path);

  if (!found) return null;

  const { data, error } = await files.info(path);

  if (error) throw storageError("read an object", error);

  return { sizeBytes: data.size ?? 0, contentType: data.contentType ?? null };
}

export async function createDownloadUrl(bucket: string, path: string, expiresInSeconds: number): Promise<string> {
  const { data, error } = await getClient().storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error) throw storageError("sign a download", error);

  return data.signedUrl;
}

/** Sign many downloads in one call; a path Storage could not sign is left out of the map. */
export async function createDownloadUrls(
  bucket: string,
  paths: string[],
  expiresInSeconds: number,
): Promise<Map<string, string>> {
  const { data, error } = await getClient().storage.from(bucket).createSignedUrls(paths, expiresInSeconds);

  if (error) throw storageError("sign downloads", error);

  return new Map(data.flatMap((item) => (item.path && item.signedUrl ? [[item.path, item.signedUrl] as const] : [])));
}

export async function removeObject(bucket: string, path: string): Promise<void> {
  const { error } = await getClient().storage.from(bucket).remove([path]);

  if (error) throw storageError("remove an object", error);
}
