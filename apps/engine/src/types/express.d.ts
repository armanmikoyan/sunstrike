import type { AuthContext } from "@/modules/auth";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
