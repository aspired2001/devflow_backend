import { Router } from "express"
import * as controller from "./comment.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/:projectId", authMiddleware, controller.createComment)

router.get("/:projectId", authMiddleware, controller.getProjectComments)

router.get("/node/:nodeId", authMiddleware, controller.getNodeComments)

export default router