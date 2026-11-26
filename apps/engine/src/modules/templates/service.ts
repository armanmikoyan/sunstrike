import { media } from "@/modules/media";
import { isUuid, notFound } from "@/shared/utils";
import { TEMPLATE_ERRORS } from "./constants";
import * as repository from "./repository";
import type { Template, TemplatePage, TemplatePageQuery, TemplateView } from "./types";
import { pairWithSources } from "./utils";

/** Templates with their signed source previews; one whose source is not ready is left out. */
async function attachSources(templates: Template[]): Promise<TemplateView[]> {
  if (templates.length === 0) return [];

  const sources = await media.getSharedAssets(templates.map((template) => template.sourceAssetId));

  return pairWithSources(templates, sources);
}

/** One page of active templates, newest first; `nextCursor` is null on the last page. */
export async function listTemplates(page: TemplatePageQuery): Promise<TemplatePage> {
  const rows = await repository.listActive(page.limit + 1, page.cursor);
  const current = rows.slice(0, page.limit);
  const last = current.at(-1);

  return {
    templates: await attachSources(current),
    nextCursor: rows.length > page.limit && last ? last.id : null,
  };
}

/** An active template whose source is ready. */
export async function getTemplate(templateId: string): Promise<TemplateView> {
  const template = isUuid(templateId) ? await repository.findActiveById(templateId) : null;
  const [view] = template ? await attachSources([template]) : [];

  if (!view) throw notFound(TEMPLATE_ERRORS.notFound);

  return view;
}
