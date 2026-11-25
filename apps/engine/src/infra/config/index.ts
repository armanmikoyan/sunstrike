import { DEFAULT_CORS_ORIGIN, DEFAULT_PORT } from "./constants";
import { parseOrigins, positiveInt, required } from "./utils";

/**
 * Environment access for the engine. Values are read on demand so importing the
 * module never requires a configured environment: the build and typecheck run
 * without one, and a missing value fails the request that needs it.
 */
export const config = {
  databaseUrl: () => required("DATABASE_URL"),
  supabaseUrl: () => required("SUPABASE_URL"),
  supabaseKey: () => required("SUPABASE_PUBLISHABLE_KEY"),
  runwareApiKey: () => required("RUNWARE_API_KEY"),
  corsOrigins: () => parseOrigins(process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN),
  port: () => positiveInt("PORT", DEFAULT_PORT),
  isProduction: () => process.env.NODE_ENV === "production",
  logLevel: () => process.env.LOG_LEVEL ?? (config.isProduction() ? "info" : "debug"),
};
