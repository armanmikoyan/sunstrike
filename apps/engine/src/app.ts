import express, { type Express } from "express";
import { config } from "@/infra/config";
import { middleware } from "@/middleware";
import { errorHandler, notFound } from "@/middleware/errors";
import { auth } from "@/modules/auth";
import authRouter from "@/modules/auth/router";
import billingRouter from "@/modules/billing/router";
import catalogRouter from "@/modules/catalog/router";
import fakeRouter from "@/modules/fake/router";
import generationsRouter from "@/modules/generations/router";
import healthRouter from "@/modules/health/router";
import mediaRouter from "@/modules/media/router";
import notificationsRouter from "@/modules/notifications/router";
import offeringsRouter from "@/modules/offerings/router";
import pricingRouter from "@/modules/pricing/router";
import templatesRouter from "@/modules/templates/router";
import usersRouter from "@/modules/users/router";

/** Wire middleware, system routes, domain module routers, and error handlers. */
export function createApp(): Express {
  const instance = express();

  instance.use(middleware);

  instance.use("/health", healthRouter);
  instance.use("/api/v1/auth", authRouter);
  instance.use("/api/v1/billing", auth.requireAuth, billingRouter);
  instance.use("/api/v1/catalog", catalogRouter);
  instance.use("/api/v1/generations", auth.requireAuth, generationsRouter);
  instance.use("/api/v1/media", auth.requireAuth, mediaRouter);
  instance.use("/api/v1/notifications", auth.requireAuth, notificationsRouter);
  instance.use("/api/v1/offerings", offeringsRouter);
  instance.use("/api/v1/pricing", pricingRouter);
  instance.use("/api/v1/templates", templatesRouter);
  instance.use("/api/v1/users", auth.requireAuth, usersRouter);

  // Temporary: dev-only stand-ins, removed with the fake module.
  if (!config.isProduction()) instance.use("/api/v1/fake", auth.requireAuth, fakeRouter);

  instance.use(notFound);
  instance.use(errorHandler);

  return instance;
}

export const app = createApp();
