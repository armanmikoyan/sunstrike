import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Studio } from "@/components/studio/studio";
import type { GenerationMode } from "@/lib/store";

type CreatePageProps = {
  params: Promise<{ mode: string }>;
};

export async function generateMetadata({
  params,
}: CreatePageProps): Promise<Metadata> {
  const { mode } = await params;
  return {
    title: mode === "image" ? "Image Studio" : "Video Studio",
  };
}

export function generateStaticParams() {
  return [{ mode: "video" }, { mode: "image" }];
}

export default async function CreatePage({ params }: CreatePageProps) {
  const { mode } = await params;
  if (mode !== "video" && mode !== "image") notFound();

  return <Studio initialMode={mode as GenerationMode} />;
}
