import { Router } from "express";
import { listNotifications, updateNotification } from "./controller";

const router = Router();

router.get("/", listNotifications);
router.patch("/:id", updateNotification);

export default router;
