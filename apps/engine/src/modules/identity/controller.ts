import type { RequestHandler } from "express";
import { resolveUser } from "./service";
import type { AuthenticatedRequest } from "./types";
import { readBearerToken } from "./utils";

export const authenticate: RequestHandler = async (request, response, next) => {
  const token = readBearerToken(request.headers.authorization);

  if (!token) {
    response.status(401).json({ error: { message: "Missing bearer token", status: 401 } });
    return;
  }

  const user = await resolveUser(token);

  if (!user) {
    response.status(401).json({ error: { message: "Invalid or expired token", status: 401 } });
    return;
  }

  (request as AuthenticatedRequest).user = user;

  next();
};

export const getMe: RequestHandler = (request, response) => {
  const { user } = request as AuthenticatedRequest;

  response.json({ user });
};
