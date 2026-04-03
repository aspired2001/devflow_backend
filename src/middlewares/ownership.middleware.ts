import { Request, Response, NextFunction } from "express"
import { prisma } from "../config/db"
import { ApiError } from "../utils/ApiError"

export const checkProjectOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId

        const projectId = (req.params.projectId || req.params.id) as string

        if (!projectId) {
            throw new ApiError(400, "Project ID is required")
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        })

        if (!project) {
            throw new ApiError(404, "Project not found")
        }

        if (project.ownerId !== userId) {
            throw new ApiError(403, "Forbidden")
        }

        next()
    } catch (error) {
        next(error)
    }
}