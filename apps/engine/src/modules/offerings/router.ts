import { Router } from "express";
import { listOfferings } from "./controller";

const router = Router();

router.get("/", listOfferings);

export default router;
