import type { ErrorRequestHandler, RequestHandler } from "express";
import { logger } from "@/infrastructure/logger";
import { httpError, messageOf, statusOf } from "./utils";

export const notFound: RequestHandler = (_request, _response, next) => {
  next(httpError(404, "Not found"));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const status = statusOf(error);

  if (status >= 500) logger.error({ err: error, status }, "Request failed");

  response.status(status).json({ error: { message: messageOf(error, status), status } });
};
