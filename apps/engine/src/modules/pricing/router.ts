import { Router } from "express";
import { calculateQuote } from "./controller";

const router = Router();

router.get("/quote", calculateQuote);

export default router;
