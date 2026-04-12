import { Router } from "express"
import * as controller from "./ai.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/:projectId", authMiddleware, controller.runAI)
router.get("/status/:jobId", authMiddleware, controller.getStatus)

export default router