import { query } from "@/infrastructure/database";
import type { IdentityRecord, IdentityRow } from "./types";
import { mapIdentityRow } from "./utils";

export async function findBySubject(authSubject: string): Promise<IdentityRecord | null> {
  const rows = await query<IdentityRow>("select id, auth_subject, user_id from identities where auth_subject = $1", [
    authSubject,
  ]);

  return rows[0] ? mapIdentityRow(rows[0]) : null;
}

export async function insert(authSubject: string, userId: string): Promise<void> {
  await query(
    `insert into identities (auth_subject, user_id) values ($1, $2)
     on conflict (auth_subject) do nothing`,
    [authSubject, userId],
  );
}
