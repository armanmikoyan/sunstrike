/** A server-side client: no session to keep, refresh or read from a URL. */
export function clientOptions() {
  return {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  };
}

export function storageError(action: string, cause: unknown): Error {
  return new Error(`Storage could not ${action}`, { cause });
}
