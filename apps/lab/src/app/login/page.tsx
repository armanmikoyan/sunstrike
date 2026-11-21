import type { Metadata } from "next";
import { Login } from "@/components/login";
import type { LoginPageProps } from "./types";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

export default async function Page({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  return <Login next={next} initialError={error} />;
}
