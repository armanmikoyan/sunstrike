import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const request = (path: string) =>
  new NextRequest(new URL(path, "http://localhost:3000"));

describe("create mode proxy", () => {
  it("lets the two real studios through", () => {
    for (const mode of ["video", "image"]) {
      const response = proxy(request(`/create/${mode}`));
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(response.status).toBe(200);
    }
  });

  it("404s an unknown mode with the not found page", () => {
    const response = proxy(request("/create/audio"));

    expect(response.status).toBe(404);
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost:3000/_not-found",
    );
  });

  it("404s the bare create route", () => {
    expect(proxy(request("/create")).status).toBe(404);
  });

  it("leaves deeper create paths alone", () => {
    const response = proxy(request("/create/video/preview"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("ignores everything outside the studio routes", () => {
    const response = proxy(request("/library"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
