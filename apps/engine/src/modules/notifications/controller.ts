import type { Request, Response } from "express";
import { badRequest, parsePageQuery, unauthorized } from "@/shared/utils";
import * as service from "./service";
import { parseReadBody } from "./utils";

export async function listNotifications(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const parsed = parsePageQuery(request.query);

  if (!parsed.ok) throw badRequest(parsed.message);

  const page = await service.listNotifications(auth.userId, parsed.value);

  response.status(200).json(page);
}

export async function updateNotification(request: Request<{ id: string }>, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const parsed = parseReadBody(request.body);

  if (!parsed.ok) throw badRequest(parsed.message);

  const notification = await service.markRead(auth.userId, request.params.id);

  response.status(200).json({ notification });
}
