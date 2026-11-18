"use client";

import { TEMPLATE_NONE, STUDIO_COPY } from "./constants";
import { templates } from "@/mocks/templates";
import { StudioSelectField } from "./studio-select-field";
import type { StudioScopedProps } from "./types";

export function StudioTemplateField({ studio }: StudioScopedProps) {
  const options = [
    { value: TEMPLATE_NONE, label: STUDIO_COPY.controls.noTemplate },
    ...templates.map((template) => ({
      value: template.id,
      label: template.name,
    })),
  ];

  return (
    <StudioSelectField
      label={STUDIO_COPY.controls.template}
      value={studio.templateId ?? TEMPLATE_NONE}
      options={options}
      onChange={(value) => studio.setTemplateId(value === TEMPLATE_NONE ? null : value)}
    />
  );
}
