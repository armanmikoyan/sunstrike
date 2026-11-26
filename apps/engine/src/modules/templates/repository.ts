import { query } from "@/infra/database";
import type { Template, TemplateRow } from "./types";
import { mapTemplateRow } from "./utils";

const columns = `
  id,
  source_asset_id,
  name,
  customization_options,
  created_at
`;

/** Active templates, newest first, starting after the template a previous page ended on. */
export async function listActive(limit: number, afterId: string | null): Promise<Template[]> {
  const rows = await query<TemplateRow>(
    `select ${columns}
     from templates
     where active = true
       and (
         $2::uuid is null
         or (created_at, id) < (select previous.created_at, previous.id from templates as previous where previous.id = $2)
       )
     order by created_at desc, id desc
     limit $1`,
    [limit, afterId],
  );

  return rows.map(mapTemplateRow);
}

export async function findActiveById(id: string): Promise<Template | null> {
  const rows = await query<TemplateRow>(`select ${columns} from templates where id = $1 and active = true`, [id]);

  return rows[0] ? mapTemplateRow(rows[0]) : null;
}
