import type { RequestHandler } from "express";
import { resolve, verify } from "./service";
import { bearer, unauthorized } from "./utils";

/**
 * Read the bearer token, validate the Supabase session, resolve its subject to
 * an application user, and attach the caller to the request for controllers.
 */
export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const token = bearer(request);

    if (!token) {
      next(unauthorized());
      return;
    }

    const subject = await verify(token);

    if (!subject) {
      next(unauthorized());
      return;
    }

    const userId = await resolve(subject.authSubject, subject.email);

    request.auth = {
      userId,
      authSubject: subject.authSubject,
      email: subject.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
