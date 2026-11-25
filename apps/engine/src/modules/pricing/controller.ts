import type { Request, Response } from "express";
import { badRequest } from "@/shared/utils";
import * as service from "./service";
import { parseQuoteQuery } from "./utils";

export async function calculateQuote(request: Request, response: Response) {
  const parsed = parseQuoteQuery(request.query);

  if (!parsed.ok) {
    throw badRequest(parsed.message);
  }

  const quote = await service.calculateQuote(parsed.value);

  response.status(200).json({ quote });
}
