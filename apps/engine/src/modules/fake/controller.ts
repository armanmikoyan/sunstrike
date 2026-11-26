import type { Request, Response } from "express";
import { badRequest, unauthorized } from "@/shared/utils";
import * as service from "./service";
import { parseTopUpBody } from "./utils";

export async function topUp(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const parsed = parseTopUpBody(request.body);

  if (!parsed.ok) throw badRequest(parsed.message);

  const balance = await service.topUp(auth.userId, parsed.value);

  response.status(200).json({ balance });
}

export async function runNextJob(_request: Request, response: Response) {
  const ran = await service.runNextJob();

  response.status(200).json({ ran });
}
