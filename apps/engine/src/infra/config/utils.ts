export function required(name: string): string {
  const value = process.env[name];

  if (!value) throw Object.assign(new Error(`${name} is not configured`), { status: 503 });

  return value;
}

export function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name];

  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
