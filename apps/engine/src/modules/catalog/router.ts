import { Router } from "express";
import { getModel, listModels } from "./controller";

const router = Router();

router.get("/", listModels);
router.get("/:id", getModel);

export default router;
