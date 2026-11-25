import type { Request, Response } from "express";
import { badRequest } from "@/shared/utils";
import * as service from "./service";
import type { ListModelsQuery } from "./types";

export async function listModels(request: Request, response: Response) {
  const { mode } = request.query as ListModelsQuery;

  if (mode !== undefined && typeof mode !== "string") {
    throw badRequest("Mode must be a string.");
  }

  const models = await service.listActiveModels(mode);

  response.status(200).json({ models });
}

export async function getModel(request: Request, response: Response) {
  const rawId = request.params.id;
  const id = typeof rawId === "string" ? rawId.trim() : "";

  if (!id) {
    throw badRequest("A model id or slug is required.");
  }

  const model = await service.getModel(id);

  response.status(200).json({ model });
}
