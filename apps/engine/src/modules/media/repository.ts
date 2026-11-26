import { query } from "@/infra/database";
import type { AssetRow, MediaAsset, NewAsset } from "./types";
import { mapAssetRow } from "./utils";

const columns = `
  id,
  owner_user_id,
  kind,
  content_type,
  size_bytes,
  storage_key,
  completed_at,
  created_at
`;

/** Record an asset: pending until its upload is checked, or already complete for a file the server stored. */
export async function insert(asset: NewAsset, completed = false): Promise<MediaAsset> {
  const rows = await query<AssetRow>(
    `insert into media_assets (id, owner_user_id, kind, content_type, size_bytes, storage_key, completed_at)
     values ($1, $2, $3, $4, $5, $6, case when $7::boolean then now() end)
     returning ${columns}`,
    [asset.id, asset.ownerUserId, asset.kind, asset.contentType, asset.sizeBytes, asset.storageKey, completed],
  );

  return mapAssetRow(rows[0]);
}

export async function findById(id: string): Promise<MediaAsset | null> {
  const rows = await query<AssetRow>(`select ${columns} from media_assets where id = $1`, [id]);

  return rows[0] ? mapAssetRow(rows[0]) : null;
}

/** Shared assets (no owner) whose upload has been checked. */
export async function findSharedReady(ids: string[]): Promise<MediaAsset[]> {
  const rows = await query<AssetRow>(
    `select ${columns}
     from media_assets
     where id = any($1::uuid[]) and owner_user_id is null and completed_at is not null`,
    [ids],
  );

  return rows.map(mapAssetRow);
}

/** Record the checked size and mark the upload complete; a second call keeps the first time. */
export async function markCompleted(id: string, sizeBytes: number): Promise<MediaAsset> {
  const rows = await query<AssetRow>(
    `update media_assets
     set size_bytes = $2, completed_at = coalesce(completed_at, now())
     where id = $1
     returning ${columns}`,
    [id, sizeBytes],
  );

  return mapAssetRow(rows[0]);
}
