import type { ErrorRequestHandler, RequestHandler } from "express";

function statusOf(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status < 600) return status;
  }
  return 500;
}

function messageOf(error: unknown, status: number): string {
  if (status === 500) return "Internal server error";
  if (error instanceof Error) return error.message;
  return "Request failed";
}

export const notFound: RequestHandler = (_request, _response, next) => {
  next(Object.assign(new Error("Not found"), { status: 404 }));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const status = statusOf(error);

  console.error(error);

  response.status(status).json({ error: { message: messageOf(error, status), status } });
};
