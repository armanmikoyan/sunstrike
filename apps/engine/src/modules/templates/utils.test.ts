import { describe, expect, it } from "vitest";
import type { AssetView } from "@/modules/media";
import type { Template } from "./types";
import { mapTemplateRow, pairWithSources, parseCustomizationOptions, parsePageQuery } from "./utils";

const TEMPLATE_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const SOURCE_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("parseCustomizationOptions", () => {
  it("maps stored snake_case lists to camelCase", () => {
    expect(
      parseCustomizationOptions({
        roles: ["subject"],
        resolutions: ["1080p"],
        durations_seconds: [5, 10],
        aspect_ratios: ["9:16"],
      }),
    ).toEqual({ roles: ["subject"], resolutions: ["1080p"], durationsSeconds: [5, 10], aspectRatios: ["9:16"] });
  });

  it("drops malformed entries and fills missing lists", () => {
    expect(parseCustomizationOptions({ roles: ["subject", 3, ""], durations_seconds: [5, "6", 0, 2.5] })).toEqual({
      roles: ["subject"],
      resolutions: [],
      durationsSeconds: [5],
      aspectRatios: [],
    });
    expect(parseCustomizationOptions(null)).toEqual({
      roles: [],
      resolutions: [],
      durationsSeconds: [],
      aspectRatios: [],
    });
  });
});

describe("mapTemplateRow", () => {
  it("returns ISO timestamps and parsed options", () => {
    expect(
      mapTemplateRow({
        id: TEMPLATE_ID,
        source_asset_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        name: "City push-in",
        customization_options: { roles: ["scene"] },
        created_at: new Date("2026-11-26T09:00:00Z"),
      }),
    ).toMatchObject({
      name: "City push-in",
      createdAt: "2026-11-26T09:00:00.000Z",
      customizationOptions: { roles: ["scene"] },
    });
  });
});

describe("pairWithSources", () => {
  const template: Template = {
    id: TEMPLATE_ID,
    sourceAssetId: SOURCE_ID,
    name: "City push-in",
    customizationOptions: { roles: [], resolutions: [], durationsSeconds: [], aspectRatios: [] },
    createdAt: "2026-11-26T09:00:00.000Z",
  };
  const source = { id: SOURCE_ID, status: "ready", url: "https://storage.test/s" } as AssetView;

  it("puts each template's source on its view, keeping the template order", () => {
    const other = { ...template, id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" };

    expect(pairWithSources([other, template], [source]).map((view) => [view.id, view.source.url])).toEqual([
      [other.id, source.url],
      [TEMPLATE_ID, source.url],
    ]);
  });

  it("leaves out a template whose source is missing", () => {
    expect(pairWithSources([template], [])).toEqual([]);
  });
});

describe("parsePageQuery", () => {
  it("defaults to the first page of 20", () => {
    expect(parsePageQuery({})).toEqual({ ok: true, value: { limit: 20, cursor: null } });
  });

  it("reads a limit and a cursor from the query string", () => {
    expect(parsePageQuery({ limit: "5", cursor: TEMPLATE_ID })).toEqual({
      ok: true,
      value: { limit: 5, cursor: TEMPLATE_ID },
    });
  });

  it.each([["0"], ["51"], ["ten"], ["2.5"]])("rejects limit %s", (limit) => {
    expect(parsePageQuery({ limit })).toMatchObject({ ok: false });
  });

  it("rejects a cursor that is not a template id", () => {
    expect(parsePageQuery({ cursor: "page-2" })).toMatchObject({ ok: false });
    expect(parsePageQuery({ cursor: ["a", "b"] })).toMatchObject({ ok: false });
  });
});
