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
