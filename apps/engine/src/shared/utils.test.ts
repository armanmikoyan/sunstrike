import { describe, expect, it } from "vitest";
import { badRequest, httpError, isUuid, notFound, unauthorized } from "./utils";

describe("shared utils", () => {
  it("builds HTTP errors with the expected status and message", () => {
    expect(httpError(409, "Conflict")).toMatchObject({ status: 409, message: "Conflict" });
    expect(badRequest("Invalid input")).toMatchObject({ status: 400, message: "Invalid input" });
    expect(unauthorized()).toMatchObject({ status: 401, message: "Unauthorized" });
    expect(notFound("Missing")).toMatchObject({ status: 404, message: "Missing" });
  });

  it("checks UUID format", () => {
    expect(isUuid("11111111-1111-4111-8111-111111111111")).toBe(true);
    expect(isUuid("chronolab-motion-2")).toBe(false);
    expect(isUuid("")).toBe(false);
  });
});
