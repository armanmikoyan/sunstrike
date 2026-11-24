import type { HttpError } from "./types";

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
