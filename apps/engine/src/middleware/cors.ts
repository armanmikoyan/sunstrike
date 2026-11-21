import cors from "cors";
import { config } from "@/infrastructure/config";

export const corsMiddleware = cors({
  origin: config.corsOrigins(),
  credentials: true,
});
