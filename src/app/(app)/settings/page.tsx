import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SettingsView } from "@/components/settings";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow="Account"
          title="Settings"
          description="Manage your studio profile, render defaults and account security."
          action={
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-lg border-white/[0.09] bg-white/[0.02] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
            >
              <Link href="/billing">
                Pay as you go · $10.54
                <ArrowUpRight className="size-3" />
              </Link>
            </Button>
          }
        />
        <SettingsView />
      </div>
      <SiteFooter />
    </>
  );
}
