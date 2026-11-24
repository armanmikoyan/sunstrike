/** An error carrying the HTTP status the error handler replies with. */
export type HttpError = Error & { status: number };
