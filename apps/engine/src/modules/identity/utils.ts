export function readBearerToken(header: string | undefined): string | null {
  if (!header) return null;

  const [scheme, token] = header.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token;
}
