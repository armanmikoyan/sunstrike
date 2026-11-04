"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsSaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <Button
      type="button"
      onClick={() => setSaved(true)}
      className="h-8 rounded-lg bg-brand px-3 text-[0.6875rem] font-medium text-brand-foreground hover:bg-brand-hover"
    >
      {saved ? <Check className="size-3" /> : null}
      {saved ? "Saved" : "Save changes"}
    </Button>
  );
}
