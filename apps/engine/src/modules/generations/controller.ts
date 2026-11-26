import type { Request, Response } from "express";
import { badRequest, parsePageQuery, unauthorized } from "@/shared/utils";
import { IDEMPOTENCY_HEADER } from "./constants";
import * as service from "./service";
import { parseCreateRequest, parseIdempotencyKey } from "./utils";

export async function createGeneration(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const key = parseIdempotencyKey(request.headers[IDEMPOTENCY_HEADER]);

  if (!key.ok) throw badRequest(key.message);

  const parsed = parseCreateRequest(request.body);

  if (!parsed.ok) throw badRequest(parsed.message);

  const generation = await service.createGeneration(auth.userId, key.value, parsed.value);

  response.status(202).json({ generation });
}

export async function listGenerations(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const parsed = parsePageQuery(request.query);

  if (!parsed.ok) throw badRequest(parsed.message);

  const page = await service.listGenerations(auth.userId, parsed.value);

  response.status(200).json(page);
}

export async function getGeneration(request: Request<{ id: string }>, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const generation = await service.getGeneration(auth.userId, request.params.id);

  response.status(200).json({ generation });
}
