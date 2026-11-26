import { describe, expect, it } from "vitest";
import {
  badRequest,
  conflict,
  contentTooLarge,
  httpError,
  isNonEmptyText,
  isoAfterSeconds,
  isOneOf,
  isPositiveNumber,
  isRecord,
  isUuid,
  isWholeNumber,
  notFound,
  parseBoolean,
  parseFailure,
  parseInteger,
  parsePageQuery,
  paymentRequired,
  toIsoString,
  toPage,
  toSafeInteger,
  unauthorized,
  unprocessable,
  unsupportedMediaType,
} from "./utils";

const ROW_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("paging", () => {
  it("defaults to the first page of 20", () => {
    expect(parsePageQuery({})).toEqual({ ok: true, value: { limit: 20, cursor: null } });
  });

  it("reads a limit and a cursor from the query string", () => {
    expect(parsePageQuery({ limit: "5", cursor: ROW_ID })).toEqual({ ok: true, value: { limit: 5, cursor: ROW_ID } });
  });

  it.each([["0"], ["51"], ["ten"], ["2.5"]])("rejects limit %s", (limit) => {
    expect(parsePageQuery({ limit })).toMatchObject({ ok: false });
  });

  it("rejects a cursor that is not a row id", () => {
    expect(parsePageQuery({ cursor: "page-2" })).toMatchObject({ ok: false });
    expect(parsePageQuery({ cursor: ["a", "b"] })).toMatchObject({ ok: false });
  });

  it("splits a limit + 1 fetch into the page and the next cursor", () => {
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];

    expect(toPage(rows, 2)).toEqual({ items: [{ id: "a" }, { id: "b" }], nextCursor: "b" });
    expect(toPage(rows, 3)).toEqual({ items: rows, nextCursor: null });
    expect(toPage([], 3)).toEqual({ items: [], nextCursor: null });
  });
});

describe("toSafeInteger", () => {
  it("reads Postgres bigint strings", () => {
    expect(toSafeInteger("1500000")).toBe(1_500_000);
    expect(toSafeInteger(42)).toBe(42);
    expect(toSafeInteger("not a number")).toBe(0);
  });

  it("answers 402 for payment required", () => {
    expect(paymentRequired("Top up")).toMatchObject({ status: 402, message: "Top up" });
  });
});

describe("shared utils", () => {
  it("builds HTTP errors with the expected status and message", () => {
    expect(httpError(409, "Conflict")).toMatchObject({ status: 409, message: "Conflict" });
    expect(badRequest("Invalid input")).toMatchObject({ status: 400, message: "Invalid input" });
    expect(unauthorized()).toMatchObject({ status: 401, message: "Unauthorized" });
    expect(notFound("Missing")).toMatchObject({ status: 404, message: "Missing" });
    expect(conflict("Not yet")).toMatchObject({ status: 409, message: "Not yet" });
    expect(contentTooLarge("Too big")).toMatchObject({ status: 413, message: "Too big" });
    expect(unsupportedMediaType("Wrong type")).toMatchObject({ status: 415, message: "Wrong type" });
    expect(unprocessable("Mismatch")).toMatchObject({ status: 422, message: "Mismatch" });
  });

  it("formats timestamps as ISO 8601", () => {
    expect(toIsoString(new Date("2026-11-26T09:00:00Z"))).toBe("2026-11-26T09:00:00.000Z");
    expect(toIsoString("2026-11-26 13:00:00+04")).toBe("2026-11-26T09:00:00.000Z");
    expect(isoAfterSeconds(new Date("2026-11-26T09:00:00Z"), 300)).toBe("2026-11-26T09:05:00.000Z");
  });

  it("checks UUID format", () => {
    expect(isUuid("11111111-1111-4111-8111-111111111111")).toBe(true);
    expect(isUuid("chronolab-motion-2")).toBe(false);
    expect(isUuid("")).toBe(false);
  });

  it("accepts text that is not blank and fits the length", () => {
    expect(isNonEmptyText("720p")).toBe(true);
    expect(isNonEmptyText("   ")).toBe(false);
    expect(isNonEmptyText(5)).toBe(false);
    expect(isNonEmptyText("abcd", 3)).toBe(false);
    expect(isNonEmptyText("abc", 3)).toBe(true);
  });

  it("builds a failed parse with its message", () => {
    expect(parseFailure("Nope.")).toEqual({ ok: false, message: "Nope." });
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
