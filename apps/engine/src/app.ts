import express, { type Express } from "express";
import { middleware } from "@/middleware";
import { errorHandler, notFound } from "@/middleware/errors";
import { auth } from "@/modules/auth";
import authRouter from "@/modules/auth/router";
import billingRouter from "@/modules/billing/router";
import catalogRouter from "@/modules/catalog/router";
import generationRouter from "@/modules/generation/router";
import healthRouter from "@/modules/health/router";
import mediaRouter from "@/modules/media/router";
import notificationsRouter from "@/modules/notifications/router";
import pricingRouter from "@/modules/pricing/router";
import templatesRouter from "@/modules/templates/router";
import usersRouter from "@/modules/users/router";

/** Wire middleware, system routes, domain module routers, and error handlers. */
export function createApp(): Express {
  const instance = express();

  instance.use(middleware);

  instance.use("/health", healthRouter);
  instance.use("/api/v1/auth", authRouter);
  instance.use("/api/v1/billing", billingRouter);
  instance.use("/api/v1/models", catalogRouter);
  instance.use("/api/v1/generation", generationRouter);
  instance.use("/api/v1/media", mediaRouter);
  instance.use("/api/v1/notifications", notificationsRouter);
  instance.use("/api/v1/pricing", pricingRouter);
  instance.use("/api/v1/templates", templatesRouter);
  instance.use("/api/v1/users", auth.requireAuth, usersRouter);

  instance.use(notFound);
  instance.use(errorHandler);

  return instance;
}

export const app = createApp();
