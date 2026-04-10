import { Router } from "express"
import * as controller from "./adr.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/:projectId", authMiddleware, controller.createADR)

router.get("/:projectId", authMiddleware, controller.listADR)

router.patch("/:id", authMiddleware, controller.updateADR)

export default router