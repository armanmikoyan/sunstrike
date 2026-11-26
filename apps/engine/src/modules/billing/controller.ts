import type { Request, Response } from "express";
import { unauthorized } from "@/shared/utils";
import * as service from "./service";

export async function getBalance(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const balance = await service.getBalance(auth.userId);

  response.status(200).json({ balance });
}
