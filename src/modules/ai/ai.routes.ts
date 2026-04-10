// ai.routes.ts
import { Router } from "express"
import * as controller from "./ai.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

router.get("/:projectId", authMiddleware, controller.runAnalysis)
router.post("/:projectId", authMiddleware, controller.runAsyncAnalysis)

router.get("/status/:jobId", authMiddleware, controller.getStatus)

export default router