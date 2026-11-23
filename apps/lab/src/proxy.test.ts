import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { REFRESH_COOKIE, SESSION_COOKIE } from "@/app/api/auth/constants";
import { proxy } from "./proxy";

function request(path: string, cookies: Record<string, string> = {}) {
  const headers = new Headers();

  if (Object.keys(cookies).length > 0) {
    headers.set(
      "cookie",
      Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join("; "),
    );
  }

  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
}

describe("settings gate", () => {
  it("sends a signed-out visitor to login with a return path", () => {
    const response = proxy(request("/settings/account"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login?next=%2Fsettings%2Faccount");
  });

  it("keeps the query string in the return path", () => {
    const response = proxy(request("/settings/billing?tab=usage"));

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Fsettings%2Fbilling%3Ftab%3Dusage",
    );
  });

  it("lets a visitor with an access cookie through", () => {
    const response = proxy(request("/settings/account", { [SESSION_COOKIE]: "jwt" }));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("lets a visitor with only a refresh cookie through", () => {
    const response = proxy(request("/settings/account", { [REFRESH_COOKIE]: "refresh" }));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});

describe("studio routing", () => {
  it("leaves a known studio alone", () => {
    expect(proxy(request("/create/video")).headers.get("x-middleware-next")).toBe("1");
    expect(proxy(request("/create/image")).headers.get("x-middleware-next")).toBe("1");
  });

  it("404s an unknown studio", () => {
    const response = proxy(request("/create/unknown"));

    expect(response.status).toBe(404);
    expect(response.headers.get("x-middleware-rewrite")).toContain("/_not-found");
  });

  it("404s the bare section, which has no studio to open", () => {
    const response = proxy(request("/create"));

    expect(response.status).toBe(404);
    expect(response.headers.get("x-middleware-rewrite")).toContain("/_not-found");
  });

  it("leaves deeper paths alone", () => {
    expect(proxy(request("/create/video/abc")).headers.get("x-middleware-next")).toBe("1");
  });

  it("ignores everything else", () => {
    expect(proxy(request("/library")).headers.get("x-middleware-next")).toBe("1");
  });
});
