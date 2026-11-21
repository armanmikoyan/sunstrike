import type { Request } from "express";
import type { IdentityRecord, IdentityRow, SessionUser } from "./types";

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

export function mapIdentityRow(row: IdentityRow): IdentityRecord {
  return {
    id: row.id,
    authSubject: row.auth_subject,
    userId: row.user_id,
  };
}

export function toSessionUser(id: string, email?: string): SessionUser {
  return { id, email: email ?? null };
}
