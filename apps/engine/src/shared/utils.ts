import type { HttpError } from "./types";

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

/** A boolean from a boolean or a query-string value `"true"` / `"false"`, else null. */
export function parseBoolean(value: unknown): boolean | null {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  return null;
}
