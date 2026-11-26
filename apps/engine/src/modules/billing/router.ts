import { Router } from "express";
import { getBalance } from "./controller";

const router = Router();

router.get("/", getBalance);

export default router;
