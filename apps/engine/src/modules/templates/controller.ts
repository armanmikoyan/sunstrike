import type { Request, Response } from "express";
import { badRequest, parsePageQuery } from "@/shared/utils";
import * as service from "./service";

export async function listTemplates(request: Request, response: Response) {
  const parsed = parsePageQuery(request.query);

  if (!parsed.ok) throw badRequest(parsed.message);

  const page = await service.listTemplates(parsed.value);

  response.status(200).json(page);
}

export async function getTemplate(request: Request<{ id: string }>, response: Response) {
  const template = await service.getTemplate(request.params.id);

  response.status(200).json({ template });
}
