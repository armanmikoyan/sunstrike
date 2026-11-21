export function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

export function statusOf(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status < 600) return status;
  }
  return 500;
}

export function messageOf(error: unknown, status: number): string {
  if (status === 500) return "Internal server error";
  if (error instanceof Error) return error.message;
  return "Request failed";
}
