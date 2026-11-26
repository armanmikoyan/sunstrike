import { PAGE_ERRORS, PAGE_LIMIT } from "./constants";
import type { HttpError, Page, PageQuery, ParseResult } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const INTEGER_PATTERN = /^-?\d+$/;

export function httpError(status: number, message: string): HttpError {
  return Object.assign(new Error(message), { status });
}

export function badRequest(message: string): HttpError {
  return httpError(400, message);
}

export function unauthorized(): HttpError {
  return httpError(401, "Unauthorized");
}

export function paymentRequired(message: string): HttpError {
  return httpError(402, message);
}

export function notFound(message: string): HttpError {
  return httpError(404, message);
}

export function conflict(message: string): HttpError {
  return httpError(409, message);
}

export function contentTooLarge(message: string): HttpError {
  return httpError(413, message);
}

export function unsupportedMediaType(message: string): HttpError {
  return httpError(415, message);
}

export function unprocessable(message: string): HttpError {
  return httpError(422, message);
}

/** An ISO 8601 timestamp from a `Date` or a database timestamp string. */
export function toIsoString(value: Date | string): string {
  return (value instanceof Date ? value : new Date(value)).toISOString();
}

/** The ISO 8601 timestamp `seconds` after `from`. */
export function isoAfterSeconds(from: Date, seconds: number): string {
  return new Date(from.getTime() + seconds * 1000).toISOString();
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A string with something other than whitespace in it, at most `maxLength` characters long. */
export function isNonEmptyText(value: unknown, maxLength = Number.POSITIVE_INFINITY): value is string {
  return typeof value === "string" && value.trim() !== "" && value.length <= maxLength;
}

/** A failed parse carrying the message the caller sends back. */
export function parseFailure(message: string): ParseResult<never> {
  return { ok: false, message };
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function isWholeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

/** An integer from a number or a query-string value such as `"6"`, else null. */
export function parseInteger(value: unknown): number | null {
  if (typeof value === "number") return Number.isInteger(value) ? value : null;

  return typeof value === "string" && INTEGER_PATTERN.test(value) ? Number.parseInt(value, 10) : null;
}

/** A whole number from a Postgres `bigint`, which `pg` returns as a string. */
export function toSafeInteger(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);

  return Number.isSafeInteger(parsed) ? parsed : 0;
}

/** `?limit=` and `?cursor=` from a query string; the cursor is the id the previous page ended on. */
export function parsePageQuery(query: unknown): ParseResult<PageQuery> {
  const { limit, cursor }: Record<string, unknown> = isRecord(query) ? query : {};
  const pageLimit = limit === undefined ? PAGE_LIMIT.default : parseInteger(limit);

  if (pageLimit === null || pageLimit < 1 || pageLimit > PAGE_LIMIT.max) return parseFailure(PAGE_ERRORS.invalidLimit);

  if (cursor === undefined) return { ok: true, value: { limit: pageLimit, cursor: null } };

  if (typeof cursor !== "string" || !isUuid(cursor)) return parseFailure(PAGE_ERRORS.invalidCursor);

  return { ok: true, value: { limit: pageLimit, cursor } };
}

/** Split rows fetched with `limit + 1` into the page and the cursor of its last row. */
export function toPage<T extends { id: string }>(rows: T[], limit: number): Page<T> {
  const items = rows.slice(0, limit);
  const last = items.at(-1);

  return { items, nextCursor: rows.length > limit && last ? last.id : null };
}

/** A boolean from a boolean or a query-string value `"true"` / `"false"`, else null. */
export function parseBoolean(value: unknown): boolean | null {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  return null;
}
