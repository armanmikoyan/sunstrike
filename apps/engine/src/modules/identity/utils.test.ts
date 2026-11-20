import { describe, expect, it } from "vitest";
import { readBearerToken } from "./utils";

describe("readBearerToken", () => {
  it("reads a bearer token regardless of case", () => {
    expect(readBearerToken("Bearer token-1")).toBe("token-1");
    expect(readBearerToken("bearer token-1")).toBe("token-1");
  });

  it("rejects a missing header", () => {
    expect(readBearerToken(undefined)).toBeNull();
  });

  it("rejects another scheme", () => {
    expect(readBearerToken("Basic token-1")).toBeNull();
  });

  it("rejects a scheme without a token", () => {
    expect(readBearerToken("Bearer")).toBeNull();
  });
});
