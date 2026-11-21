import compression from "compression";
import express, { type RequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@/infrastructure/config";
import { corsMiddleware } from "./cors";

const logFormat = config.isProduction() ? "combined" : "dev";

export const middleware: RequestHandler[] = [
  helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }),
  corsMiddleware,
  compression(),
  express.json({ limit: "1mb" }),
  morgan(logFormat, {
    skip: (request) => /\/health(?:\?|$)/.test(request.url ?? ""),
  }),
];
