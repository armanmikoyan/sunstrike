import type { Request, Response } from "express";
import { badRequest, unauthorized } from "@/shared/utils";
import * as service from "./service";
import { parseUploadRequest } from "./utils";

export async function requestUpload(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const parsed = parseUploadRequest(request.body);

  if (!parsed.ok) throw badRequest(parsed.message);

  const ticket = await service.requestUpload(auth.userId, parsed.value);

  response.status(201).json(ticket);
}

export async function completeUpload(request: Request<{ id: string }>, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const asset = await service.completeUpload(auth.userId, request.params.id);

  response.status(200).json({ asset });
}

export async function getAsset(request: Request<{ id: string }>, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const asset = await service.getAsset(auth.userId, request.params.id);

  response.status(200).json({ asset });
}
