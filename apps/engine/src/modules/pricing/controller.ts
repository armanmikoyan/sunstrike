import type { Request, Response } from "express";
import { badRequest } from "@/shared/utils";
import * as service from "./service";
import type { ListRatesQuery } from "./types";
import { parseQuoteRequest } from "./utils";

export async function listRates(request: Request, response: Response) {
  const { mode } = request.query as ListRatesQuery;

  if (mode !== undefined && typeof mode !== "string") {
    throw badRequest("Mode must be a string.");
  }

  const rates = await service.listRates(mode);

  response.status(200).json({ rates });
}

export async function createQuote(request: Request, response: Response) {
  const parsed = parseQuoteRequest(request.body);

  if (!parsed.ok) {
    throw badRequest(parsed.message);
  }

  const quote = await service.createQuote(parsed.value);

  response.status(200).json({ quote });
}
