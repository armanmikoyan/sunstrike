export function sessionMaxAge(expiresAt: number, now = Date.now()): number {
  return Math.max(0, expiresAt - Math.floor(now / 1000));
}
