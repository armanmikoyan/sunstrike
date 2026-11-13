import type { Template } from "@/lib/design";

/**
 * Curated templates from 02 Core entities. Each one points at a source media
 * asset and declares the options a user may change before generating.
 */
export const templates: Template[] = [
  {
    id: "tpl_product_turntable",
    sourceAssetId: "17",
    name: "Product turntable",
    customizationOptions: {
      roles: ["product"],
      settings: { resolution: ["1080p"], duration: ["6s"], aspectRatio: ["1:1"] },
    },
    createdAt: "2026-10-02T09:00:00.000Z",
  },
  {
    id: "tpl_city_push",
    sourceAssetId: "10",
    name: "City push-in",
    customizationOptions: {
      roles: ["scene"],
      settings: { resolution: ["1080p"], duration: ["5s"], aspectRatio: ["16:9"] },
    },
    createdAt: "2026-10-06T09:00:00.000Z",
  },
  {
    id: "tpl_motion_transfer",
    sourceAssetId: "01",
    name: "Motion transfer",
    customizationOptions: {
      roles: ["motion", "subject"],
      settings: { resolution: ["1080p"], duration: ["6s"], aspectRatio: ["9:16"] },
    },
    createdAt: "2026-10-11T09:00:00.000Z",
  },
  {
    id: "tpl_editorial_still",
    sourceAssetId: "05",
    name: "Editorial still",
    customizationOptions: {
      roles: ["subject"],
      settings: { resolution: ["2 MP"], duration: [], aspectRatio: ["3:4"] },
    },
    createdAt: "2026-10-16T09:00:00.000Z",
  },
];

export const templateById = (id: string) =>
  templates.find((template) => template.id === id);
