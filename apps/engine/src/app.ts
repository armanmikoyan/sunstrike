import express from "express";
import { middleware } from "@/middleware";
import { errorHandler, notFound } from "@/middleware/errors";
import identityRouter from "@/modules/identity/router";
import billingRouter from "@/modules/billing/router";
import catalogRouter from "@/modules/catalog/router";
import generationRouter from "@/modules/generation/router";
import mediaRouter from "@/modules/media/router";
import notificationsRouter from "@/modules/notifications/router";
import templatesRouter from "@/modules/templates/router";

export const app = express();

app.use(middleware);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/v1", identityRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/catalog", catalogRouter);
app.use("/api/v1/generation", generationRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/templates", templatesRouter);

app.use(notFound);
app.use(errorHandler);
