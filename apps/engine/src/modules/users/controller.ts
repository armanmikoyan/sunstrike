import type { Request, Response } from "express";
import * as service from "./service";
import { unauthorized } from "./utils";

export async function getCurrentUser(request: Request, response: Response) {
  const auth = request.auth;

  if (!auth) throw unauthorized();

  const user = await service.getCurrentUser(auth.userId);

  response.status(200).json({ user });
}
