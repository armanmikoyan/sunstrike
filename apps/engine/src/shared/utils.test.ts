import { describe, expect, it } from "vitest";
import {
  badRequest,
  httpError,
  isOneOf,
  isPositiveNumber,
  isRecord,
  isUuid,
  isWholeNumber,
  notFound,
  parseBoolean,
  parseInteger,
  unauthorized,
} from "./utils";

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

  it("narrows unknown values to records, numbers and allowed strings", () => {
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);

    expect(isPositiveNumber(0.5)).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(Number.POSITIVE_INFINITY)).toBe(false);

    expect(isWholeNumber(0)).toBe(true);
    expect(isWholeNumber(1.5)).toBe(false);
    expect(isWholeNumber(-1)).toBe(false);

    expect(isOneOf(["video", "image"], "image")).toBe(true);
    expect(isOneOf(["video", "image"], "3d")).toBe(false);
    expect(isOneOf(["video", "image"], 1)).toBe(false);
  });

  it("parses integers and booleans from numbers, booleans and query strings", () => {
    expect(parseInteger(6)).toBe(6);
    expect(parseInteger("6")).toBe(6);
    expect(parseInteger("-2")).toBe(-2);
    expect(parseInteger("1.5")).toBeNull();
    expect(parseInteger("6s")).toBeNull();
    expect(parseInteger(["6"])).toBeNull();

    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean("yes")).toBeNull();
  });
});
