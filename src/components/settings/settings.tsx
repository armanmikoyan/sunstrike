import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { settingsCopy } from "./constants";
import { SettingsView } from "./settings-view";

export function Settings() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow={settingsCopy.eyebrow}
          title={settingsCopy.title}
          description={settingsCopy.description}
          action={
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-lg border-white/[0.09] bg-white/[0.02] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
            >
              <Link href="/billing">
                {settingsCopy.balanceAction}
                <ArrowUpRight className="size-3" />
              </Link>
            </Button>
          }
        />
        <SettingsView />
      </div>
    </>
  );
}
