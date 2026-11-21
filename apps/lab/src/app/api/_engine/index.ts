import { NextResponse } from "next/server";
import type { EngineFailure, EngineHeaders, EngineRequestOptions, EngineResult } from "./types";

function engineUrl(): string {
  const url = process.env.ENGINE_URL;

  if (!url) throw new Error("ENGINE_URL is not set.");

  return url.replace(/\/+$/, "");
}

function engineMessage(body: unknown, fallback = "The request could not be completed."): string {
  if (typeof body === "string" && body) return body;

  if (typeof body !== "object" || body === null) return fallback;

  const { error, message } = body as Record<string, unknown>;

  if (typeof error === "string" && error) return error;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  if (typeof message === "string" && message) return message;

  return fallback;
}

export async function engineRequest<T>(path: string, options: EngineRequestOptions = {}): Promise<EngineResult<T>> {
  let base: string;

  try {
    base = engineUrl();
  } catch {
    return { ok: false, status: 503, message: "The service is not configured." };
  }

  const headers: EngineHeaders = {
    accept: "application/json",
    "content-type": "application/json",
  };

  if (options.token) headers.authorization = `Bearer ${options.token}`;

  try {
    const response = await fetch(`${base}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });

    if (response.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: engineMessage(body),
      };
    }

    return { ok: true, data: body as T };
  } catch {
    return { ok: false, status: 503, message: "The service is unavailable." };
  }
}

export function errorResponse(failure: EngineFailure) {
  const status = failure.status >= 400 && failure.status <= 599 ? failure.status : 502;
  const message = status >= 500 ? "The request could not be completed." : failure.message;

  return NextResponse.json({ error: message }, { status });
}
