import { query } from "@/infrastructure/database";
import type { ProvisionUserInput, UserProfile, UserRow } from "./types";
import { mapUserRow } from "./utils";

export async function getById(id: string): Promise<UserProfile | null> {
  const rows = await query<UserRow>("select id, email, created_at from users where id = $1", [id]);

  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function upsert(input: ProvisionUserInput): Promise<UserProfile> {
  const rows = await query<UserRow>(
    `insert into users (id, email) values ($1, $2)
     on conflict (id) do update set email = coalesce(excluded.email, users.email)
     returning id, email, created_at`,
    [input.id, input.email ?? null],
  );

  const row = rows[0];

  if (!row) throw new Error("Failed to provision user");

  return mapUserRow(row);
}

export async function syncEmail(id: string, email: string): Promise<void> {
  await query("update users set email = $2 where id = $1 and email is distinct from $2", [id, email]);
}

export async function updateEmail(id: string, email: string): Promise<UserProfile | null> {
  const rows = await query<UserRow>("update users set email = $2 where id = $1 returning id, email, created_at", [
    id,
    email,
  ]);

  return rows[0] ? mapUserRow(rows[0]) : null;
}
