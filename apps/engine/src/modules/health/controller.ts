import type { Request, Response } from "express";
import * as service from "./service";

export async function getHealth(_request: Request, response: Response) {
  response.set("Cache-Control", "no-store");

  const { statusCode, body } = await service.getHealth();

  response.status(statusCode).json(body);
}
