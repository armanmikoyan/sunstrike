import { Router } from "express";
import { runNextJob, topUp } from "./controller";

const router = Router();

router.post("/top-ups", topUp);
router.post("/jobs/run", runNextJob);

export default router;
