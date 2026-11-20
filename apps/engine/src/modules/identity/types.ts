import type { Request, RequestHandler } from "express";

export interface IdentityUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthenticatedRequest extends Request {
  user: IdentityUser;
}

export interface IdentityContract {
  authenticate: RequestHandler;
  resolveUser: (accessToken: string) => Promise<IdentityUser | null>;
}
