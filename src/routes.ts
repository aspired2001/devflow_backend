import { Router } from "express"
import authRoutes from "./modules/auth/auth.routes"
import projectRoutes from "./modules/projects/project.routes"
import diagramRoutes from "./modules/diagrams/diagram.routes"
import commentRoutes from "./modules/comments/comment.routes"
import adrRoutes from "./modules/adr/adr.routes"

import aiRoutes from "./modules/ai/ai.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/projects", projectRoutes)
router.use("/diagrams", diagramRoutes)

router.use("/comments", commentRoutes)
router.use("/adr", adrRoutes)
router.use("/ai", aiRoutes)
export default router