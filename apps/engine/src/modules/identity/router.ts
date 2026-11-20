import { Router } from "express";
import { authenticate, getMe } from "./controller";

const router = Router();

router.get("/me", authenticate, getMe);

export default router;
