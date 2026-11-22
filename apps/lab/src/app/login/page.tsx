import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REFRESH_COOKIE, SESSION_COOKIE } from "@/app/api/auth/constants";
import { Login } from "@/components/login";
import type { LoginPageProps } from "./types";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

export default async function Page({ searchParams }: LoginPageProps) {
  const store = await cookies();

  if (store.has(SESSION_COOKIE) || store.has(REFRESH_COOKIE)) redirect("/");

  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  return <Login next={next} initialError={error} />;
}
