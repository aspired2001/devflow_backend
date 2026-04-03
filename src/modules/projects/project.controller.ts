import { Request, Response } from "express"
import * as service from "./project.service"

export const createProject = async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = req.user!.userId

    const project = await service.createProject(name, userId)

    res.json(project)
}

export const listProjects = async (req: Request, res: Response) => {
    const userId = req.user!.userId

    const projects = await service.listProjects(userId)

    res.json(projects)
}

export const deleteProject = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params
    const userId = req.user!.userId

    await service.deleteProject(id, userId)

    res.json({ message: "deleted" })
}

export const updateProject = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params
    const { name } = req.body
    const userId = req.user!.userId

    const project = await service.updateProject(id, name, userId)

    res.json(project)
}