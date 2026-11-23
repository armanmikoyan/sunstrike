/**
 * Supabase reports the remaining wait only inside its own sentence
 * ("...you can only request this after 24 seconds."). Pull the number out so
 * the UI can show a countdown instead of the raw wording, and fall back to the
 * default window when the message has no number.
 */
export function cooldownSeconds(message: string, fallback = 60): number {
  const match = /after (\d+) seconds?/i.exec(message);

  if (!match) return fallback;

  return Math.min(Math.max(Number(match[1]), 1), 300);
}
