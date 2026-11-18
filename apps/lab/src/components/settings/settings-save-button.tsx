"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/ui/button";
import { SETTINGS_COPY } from "./constants";

export function SettingsSaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <Button type="button" size="cta-xs" onClick={() => setSaved(true)}>
      {saved ? <Check className="size-3" /> : null}
      {saved ? SETTINGS_COPY.save.saved : SETTINGS_COPY.save.action}
    </Button>
  );
}
