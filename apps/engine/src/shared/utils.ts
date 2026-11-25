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
