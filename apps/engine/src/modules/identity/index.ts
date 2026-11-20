import { authenticate } from "./controller";
import { resolveUser } from "./service";
import type { IdentityContract } from "./types";

export type { AuthenticatedRequest, IdentityUser } from "./types";

export const identity: IdentityContract = { authenticate, resolveUser };
