import { Request, Response } from "express"
import * as service from "./diagram.service"

export const saveDiagram = async (
    req: Request<{ projectId: string }>,
    res: Response
) => {
    const { projectId } = req.params
    const { data } = req.body

    const version = await service.saveVersion(projectId, data)

    res.json(version)
}

export const getDiagram = async (
    req: Request<{ projectId: string }>,
    res: Response
) => {
    const { projectId } = req.params

    const diagram = await service.getLatestDiagram(projectId)

    res.json(diagram)
}

export const listVersions = async (
    req: Request<{ projectId: string }>,
    res: Response
) => {
    const { projectId } = req.params

    const versions = await service.getVersions(projectId)

    res.json(versions)
}

export const restore = async (
    req: Request<{ versionId: string }>,
    res: Response
) => {
    const { versionId } = req.params
    const userId = req.user!.userId

    const version = await service.restoreVersion(versionId, userId)

    res.json(version)
}

export const getStats = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.userId

    const stats = await service.getStats(userId)

    res.json(stats)
}