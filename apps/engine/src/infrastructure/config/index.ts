/**
 * Environment access for the engine. Values are read on demand so importing the
 * module never requires a configured environment: the build and typecheck run
 * without one, and a missing value fails the request that needs it.
 */
function required(name: string): string {
  const value = process.env[name];

  if (!value) throw Object.assign(new Error(`${name} is not configured`), { status: 503 });

  return value;
}

export const config = {
  databaseUrl: () => required("DATABASE_URL"),
  supabaseUrl: () => required("SUPABASE_URL"),
  supabaseAnonKey: () => required("SUPABASE_ANON_KEY"),
  corsOrigins: () =>
    (process.env.CORS_ORIGIN ?? "http://localhost:3000")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  port: () => Number(process.env.PORT ?? 4000),
  isProduction: () => process.env.NODE_ENV === "production",
};
