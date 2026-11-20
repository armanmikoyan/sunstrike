import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyAccessToken } from "@/infrastructure/supabase";
import { resolveUser } from "./service";

vi.mock("@/infrastructure/supabase", () => ({ verifyAccessToken: vi.fn() }));

const verify = vi.mocked(verifyAccessToken);

describe("resolveUser", () => {
  beforeEach(() => {
    verify.mockReset();
  });

  it("maps a verified token to the identity user", async () => {
    verify.mockResolvedValue({
      id: "user-1",
      email: "ada@example.com",
      created_at: "2026-01-02T03:04:05Z",
    });

    await expect(resolveUser("token")).resolves.toEqual({
      id: "user-1",
      email: "ada@example.com",
      createdAt: "2026-01-02T03:04:05Z",
    });
  });

  it("returns null when the token is rejected", async () => {
    verify.mockResolvedValue(null);

    await expect(resolveUser("token")).resolves.toBeNull();
  });

  it("keeps the user when the session has no email", async () => {
    verify.mockResolvedValue({ id: "user-2" });

    await expect(resolveUser("token")).resolves.toEqual({
      id: "user-2",
      email: "",
      createdAt: "",
    });
  });
});
