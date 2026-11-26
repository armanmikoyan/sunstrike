import { Router } from "express";
import { completeUpload, getAsset, requestUpload } from "./controller";

const router = Router();

router.post("/uploads", requestUpload);
router.post("/:id/complete", completeUpload);
router.get("/:id", getAsset);

export default router;
