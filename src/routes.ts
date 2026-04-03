import { Router } from "express"
import authRoutes from "./modules/auth/auth.routes"
import projectRoutes from "./modules/projects/project.routes"
import diagramRoutes from "./modules/diagrams/diagram.routes"
const router = Router()

router.use("/auth", authRoutes)
router.use("/projects", projectRoutes)
router.use("/diagrams", diagramRoutes)
export default router