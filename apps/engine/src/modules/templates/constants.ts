/** How many templates one page holds when the client does not ask, and at most. */
export const PAGE_LIMIT = { default: 20, max: 50 } as const;

export const TEMPLATE_ERRORS = {
  notFound: "Template not found.",
  invalidLimit: `limit must be a whole number from 1 to ${PAGE_LIMIT.max}.`,
  invalidCursor: "cursor must be the nextCursor of a previous page.",
} as const;
