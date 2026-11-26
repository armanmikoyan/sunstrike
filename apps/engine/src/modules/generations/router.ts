import { Router } from "express";
import { createGeneration, getGeneration, listGenerations } from "./controller";

const router = Router();

router.post("/", createGeneration);
router.get("/", listGenerations);
router.get("/:id", getGeneration);

export default router;
