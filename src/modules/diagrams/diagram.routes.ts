import { Router } from "express"
import * as controller from "./diagram.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { checkProjectOwnership } from "../../middlewares/ownership.middleware"

const router = Router()

router.get("/stats", authMiddleware, controller.getStats)

router.post("/:projectId/save", authMiddleware, checkProjectOwnership, controller.saveDiagram)

router.get("/:projectId", authMiddleware, checkProjectOwnership, controller.getDiagram)

router.get("/:projectId/versions", authMiddleware, checkProjectOwnership, controller.listVersions)

router.post("/restore/:versionId", authMiddleware, controller.restore)

export default router