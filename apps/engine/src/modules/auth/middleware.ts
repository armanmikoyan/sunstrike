import type { RequestHandler } from "express";
import { unauthorized } from "@/shared/utils";
import { ensureUser, verify } from "./service";
import { bearer } from "./utils";

/**
 * Read the bearer token, validate the Supabase session, ensure its subject has
 * a profile row, and attach that profile's id to the request for controllers.
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

    const profile = await ensureUser(subject);

    request.auth = {
      userId: profile.id,
      authSubject: subject.authSubject,
    };

    next();
  } catch (error) {
    next(error);
  }
};
