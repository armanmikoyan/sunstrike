import type { Request, Response } from "express";
import * as service from "./service";
import type { CallbackBody, OAuthBody, OAuthProvider, OtpRequestBody, OtpVerifyBody, RefreshBody } from "./types";
import { badRequest, bearer, unauthorized } from "./utils";

export async function sendOtpCode(request: Request, response: Response) {
  const { email } = (request.body ?? {}) as OtpRequestBody;

  if (typeof email !== "string" || !email.trim()) {
    throw badRequest("An email is required.");
  }

  await service.sendOtpCode(email.trim());

  response.status(202).json({ ok: true });
}

export async function verifyOtpCode(request: Request, response: Response) {
  const { email, token } = (request.body ?? {}) as OtpVerifyBody;

  if (typeof email !== "string" || !email.trim() || typeof token !== "string" || !token.trim()) {
    throw badRequest("An email and code are required.");
  }

  const session = await service.verifyOtpCode(email.trim(), token.trim());

  response.status(200).json(session);
}

export async function getSessionUser(request: Request, response: Response) {
  const token = bearer(request);

  if (!token) throw unauthorized();

  const user = await service.getSessionUser(token);

  if (!user) throw unauthorized();

  response.status(200).json({ user });
}

export async function refreshSession(request: Request, response: Response) {
  const { refreshToken } = (request.body ?? {}) as RefreshBody;

  if (typeof refreshToken !== "string" || !refreshToken) {
    throw badRequest("A refresh token is required.");
  }

  const session = await service.refreshSession(refreshToken);

  response.status(200).json(session);
}

export async function signOut(request: Request, response: Response) {
  const token = bearer(request);

  if (token) await service.signOut(token);

  response.status(204).end();
}

async function startOAuth(provider: OAuthProvider, request: Request, response: Response) {
  const { redirectTo } = (request.body ?? {}) as OAuthBody;

  if (typeof redirectTo !== "string" || !redirectTo) {
    throw badRequest("A redirect URL is required.");
  }

  const start = await service.startOAuthSignIn(provider, redirectTo);

  response.status(200).json(start);
}

export async function startGoogleSignIn(request: Request, response: Response) {
  await startOAuth("google", request, response);
}

export async function startGithubSignIn(request: Request, response: Response) {
  await startOAuth("github", request, response);
}

export async function startAppleSignIn(request: Request, response: Response) {
  await startOAuth("apple", request, response);
}

export async function completeOAuthSignIn(request: Request, response: Response) {
  const { code, codeVerifier, flowId } = (request.body ?? {}) as CallbackBody;

  if (typeof code !== "string" || !code || typeof codeVerifier !== "string" || !codeVerifier) {
    throw badRequest("A code and verifier are required.");
  }

  const session = await service.completeOAuthSignIn(code, codeVerifier, typeof flowId === "string" ? flowId : null);

  response.status(200).json(session);
}
