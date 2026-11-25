import type { Request, Response } from "express";
import { badRequest } from "@/shared/utils";
import * as service from "./service";
import type { ListOfferingsQuery } from "./types";

export async function listOfferings(request: Request, response: Response) {
  const { mode } = request.query as ListOfferingsQuery;

  if (mode !== undefined && typeof mode !== "string") {
    throw badRequest("Mode must be a string.");
  }

  const offerings = await service.listOfferings(mode);

  response.status(200).json({ offerings });
}
