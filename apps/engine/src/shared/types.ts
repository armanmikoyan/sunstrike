/** An error carrying the HTTP status the error handler replies with. */
export type HttpError = Error & { status: number };

/** The outcome of reading untrusted input: the value, or the message to reply with. */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };
