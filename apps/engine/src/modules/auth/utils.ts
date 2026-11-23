import type { Request } from "express";
import type { SessionUser } from "./types";

export function bearer(request: Request): string | null {
  const [scheme, token] = (request.header("authorization") ?? "").split(" ");

  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

export function badRequest(message: string) {
  return Object.assign(new Error(message), { status: 400 });
}

export function unauthorized() {
  return Object.assign(new Error("Unauthorized"), { status: 401 });
}

export function toSessionUser(id: string, email?: string): SessionUser {
  return { id, email: email ?? null };
}
