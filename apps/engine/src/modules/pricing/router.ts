import { Router } from "express";
import { createQuote, listRates } from "./controller";

const router = Router();

router.get("/rates", listRates);
router.post("/quotes", createQuote);

export default router;
