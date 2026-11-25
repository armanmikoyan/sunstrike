import type { HttpError } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
