import { query } from "@/infra/database";
import type { ProvisionUserInput, UserProfile, UserRow } from "./types";
import { mapUserRow } from "./utils";

const columns = "id, email, avatar_url, created_at";

export async function getById(id: string): Promise<UserProfile | null> {
  const rows = await query<UserRow>(`select ${columns} from users where id = $1`, [id]);

  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function upsert(input: ProvisionUserInput): Promise<UserProfile> {
  // The avatar is sticky: an existing face wins over whatever a later sign-in
  // offers, so switching providers never swaps the picture.
  const rows = await query<UserRow>(
    `insert into users (id, email, avatar_url) values ($1, $2, $3)
     on conflict (id) do update set
       email = coalesce(excluded.email, users.email),
       avatar_url = coalesce(users.avatar_url, excluded.avatar_url)
     returning ${columns}`,
    [input.id, input.email ?? null, input.avatarUrl ?? null],
  );

  const row = rows[0];

  if (!row) throw new Error("Failed to provision user");

  return mapUserRow(row);
}

export async function syncEmail(id: string, email: string): Promise<void> {
  await query("update users set email = $2 where id = $1 and email is distinct from $2", [id, email]);
}

export async function syncAvatar(id: string, avatarUrl: string): Promise<void> {
  await query("update users set avatar_url = $2 where id = $1 and avatar_url is null", [id, avatarUrl]);
}
