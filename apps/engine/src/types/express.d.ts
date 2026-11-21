import type { AuthContext } from "@/modules/identity";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
