import express from "express";
import { middleware } from "@/middleware";
import { errorHandler, notFound } from "@/middleware/errors";
import authRouter from "@/modules/auth";
import billingRouter from "@/modules/billing";
import catalogRouter from "@/modules/catalog";
import generationRouter from "@/modules/generation";
import mediaRouter from "@/modules/media";
import notificationsRouter from "@/modules/notifications";
import templatesRouter from "@/modules/templates";

export const app = express();

app.use(middleware);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/catalog", catalogRouter);
app.use("/api/v1/generation", generationRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/templates", templatesRouter);

app.use(notFound);
app.use(errorHandler);
