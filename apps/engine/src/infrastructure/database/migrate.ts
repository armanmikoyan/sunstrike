import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { config } from "@/infrastructure/config";

const migrationsDirectory = fileURLToPath(new URL("../supabase/migrations", import.meta.url));

/**
 * The ledger is its own table so `db:migrate` can be re-run at any time. RLS is
 * enabled without policies: only the database role that runs migrations sees it.
 */
const ledger = `
  create table if not exists public.schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  );

  alter table public.schema_migrations enable row level security;
`;

async function migrate(): Promise<void> {
  const client = new Client({ connectionString: config.databaseUrl() });

  await client.connect();

  try {
    await client.query(ledger);

    const { rows } = await client.query<{ name: string }>("select name from public.schema_migrations");
    const applied = new Set(rows.map((row) => row.name));
    const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql")).toSorted();
    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.info("Database is up to date.");

      return;
    }

    for (const file of pending) {
      const sql = await readFile(join(migrationsDirectory, file), "utf8");

      // Each file is one transaction: either the schema move and its ledger row
      // both land, or neither does.
      await client.query("begin");

      try {
        await client.query(sql);
        await client.query("insert into public.schema_migrations (name) values ($1)", [file]);
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      }

      console.info(`applied ${file}`);
    }

    console.info(`Done: ${pending.length} migration(s) applied.`);
  } finally {
    await client.end();
  }
}

try {
  await migrate();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
