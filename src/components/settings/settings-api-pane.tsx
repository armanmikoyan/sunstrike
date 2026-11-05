import { Plus } from "lucide-react";
import { Button } from "@/ui/button";
import { apiQuickStart, settingsCopy } from "./constants";

export function SettingsApiPane() {
  const copy = settingsCopy.api;

  return (
    <div>
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[0.8125rem] font-medium">{copy.title}</h2>
        <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
          <div>
            <p className="text-[0.6875rem] font-medium">{copy.productionKey}</p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
              {copy.maskedKey}
            </p>
            <p className="mt-1.5 text-[0.6875rem] text-muted-foreground">
              {copy.lastUsed}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-white/10 bg-transparent text-[0.6875rem] hover:bg-white/[0.04]"
          >
            {copy.revoke}
          </Button>
        </div>
        <Button
          variant="outline"
          className="mt-3 h-8 rounded-lg border-dashed border-white/15 bg-transparent text-[0.6875rem] text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
        >
          <Plus className="size-3" />
          {copy.createKey}
        </Button>
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#18191c] p-4">
          <p className="text-[0.6875rem] text-muted-foreground">
            {copy.quickStart}
          </p>
          <pre className="mt-2 overflow-x-auto text-[0.75rem] leading-relaxed text-foreground/70">
            {apiQuickStart}
          </pre>
        </div>
      </div>
    </div>
  );
}
