/** An error carrying the HTTP status the error handler replies with. */
export type HttpError = Error & { status: number };

/** The outcome of reading untrusted input: the value, or the message to reply with. */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

/** A page request: how many rows, and the id of the row the previous page ended on. */
export interface PageQuery {
  limit: number;
  cursor: string | null;
}

/** One page of rows; `nextCursor` is null on the last page. */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
