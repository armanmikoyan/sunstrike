/** How many rows one page holds when the client does not ask, and at most. */
export const PAGE_LIMIT = { default: 20, max: 50 } as const;

export const PAGE_ERRORS = {
  invalidLimit: `limit must be a whole number from 1 to ${PAGE_LIMIT.max}.`,
  invalidCursor: "cursor must be the nextCursor of a previous page.",
} as const;
