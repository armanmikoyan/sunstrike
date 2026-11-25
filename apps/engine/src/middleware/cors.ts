import cors from "cors";
import { config } from "@/infra/config";

export const corsMiddleware = cors({
  origin: config.corsOrigins(),
  credentials: true,
});
