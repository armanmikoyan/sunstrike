import { query } from "@/infra/database";
import type { Generation, GenerationRow, NewGeneration, Outcome } from "./types";
import { mapGenerationRow } from "./utils";

const columns = `
  id,
  user_id,
  idempotency_key,
  kind,
  prompt,
  template_id,
  model_id,
  settings,
  inputs,
  quote,
  status,
  failure_code,
  output_asset_id,
  attempts,
  run_after,
  created_at,
  completed_at
`;

function first(rows: GenerationRow[]): Generation | null {
  return rows[0] ? mapGenerationRow(rows[0]) : null;
}

/** Record a generation that is not due yet; null when the user already sent this idempotency key. */
export async function insert(generation: NewGeneration): Promise<Generation | null> {
  const rows = await query<GenerationRow>(
    `insert into generations (id, user_id, idempotency_key, kind, prompt, template_id, model_id, settings, inputs, quote)
     values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb)
     on conflict (user_id, idempotency_key) do nothing
     returning ${columns}`,
    [
      generation.id,
      generation.userId,
      generation.idempotencyKey,
      generation.kind,
      generation.prompt,
      generation.templateId,
      generation.modelId,
      JSON.stringify(generation.settings),
      JSON.stringify(generation.inputs),
      JSON.stringify(generation.quote),
    ],
  );

  return first(rows);
}

export async function findByIdempotencyKey(userId: string, idempotencyKey: string): Promise<Generation | null> {
  return first(
    await query<GenerationRow>(`select ${columns} from generations where user_id = $1 and idempotency_key = $2`, [
      userId,
      idempotencyKey,
    ]),
  );
}

export async function findForUser(userId: string, id: string): Promise<Generation | null> {
  return first(
    await query<GenerationRow>(`select ${columns} from generations where user_id = $1 and id = $2`, [userId, id]),
  );
}

/** A user's generations, newest first, starting after the generation a previous page ended on. */
export async function listForUser(userId: string, limit: number, afterId: string | null): Promise<Generation[]> {
  const rows = await query<GenerationRow>(
    `select ${columns}
     from generations
     where user_id = $1
       and (
         $3::uuid is null
         or (created_at, id) < (
           select previous.created_at, previous.id
           from generations as previous
           where previous.id = $3 and previous.user_id = $1
         )
       )
     order by created_at desc, id desc
     limit $2`,
    [userId, limit, afterId],
  );

  return rows.map(mapGenerationRow);
}

/** Make a generation due once its price is held. */
export async function markDue(id: string): Promise<Generation | null> {
  return first(
    await query<GenerationRow>(
      `update generations set run_after = coalesce(run_after, now()) where id = $1 returning ${columns}`,
      [id],
    ),
  );
}

/** Drop a generation whose price could not be held; a due one is never removed. */
export async function removeUnpaid(id: string): Promise<void> {
  await query("delete from generations where id = $1 and run_after is null", [id]);
}

/**
 * Lease the oldest due job: a queued one whose time has come, or a running
 * one whose lease ran out because its worker stopped. Each claim counts an attempt.
 */
export async function claimNext(leaseSeconds: number): Promise<Generation | null> {
  return first(
    await query<GenerationRow>(
      `update generations
       set status = 'running',
           attempts = attempts + 1,
           lease_expires_at = now() + make_interval(secs => $1)
       where id = (
         select id
         from generations
         where (status = 'queued' and run_after <= now())
            or (status = 'running' and lease_expires_at < now())
         order by run_after
         limit 1
         for update skip locked
       )
       returning ${columns}`,
      [leaseSeconds],
    ),
  );
}

/** Put a failed attempt back in the queue; ignored when another worker has claimed the job since. */
export async function requeue(id: string, attempt: number, delaySeconds: number): Promise<void> {
  await query(
    `update generations
     set status = 'queued', run_after = now() + make_interval(secs => $3), lease_expires_at = null
     where id = $1 and status = 'running' and attempts = $2`,
    [id, attempt, delaySeconds],
  );
}

/** Close a claimed attempt; null when another worker has claimed the job since. */
export async function finish(id: string, attempt: number, outcome: Outcome): Promise<Generation | null> {
  return first(
    await query<GenerationRow>(
      `update generations
       set status = $3, failure_code = $4, output_asset_id = $5, completed_at = now(), lease_expires_at = null
       where id = $1 and status = 'running' and attempts = $2
       returning ${columns}`,
      [id, attempt, outcome.status, outcome.failureCode, outcome.outputAssetId],
    ),
  );
}
