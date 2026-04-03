import { Router } from "express"
import * as controller from "./project.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/", authMiddleware, controller.createProject)

router.get("/", authMiddleware, controller.listProjects)

router.patch("/:id", authMiddleware, controller.updateProject)

router.delete("/:id", authMiddleware, controller.deleteProject)

export default router