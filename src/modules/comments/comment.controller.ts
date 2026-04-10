import { Request, Response } from "express"
import * as service from "./comment.service"
import { getParam } from "../../utils/getParam"

export const createComment = async (req: Request, res: Response) => {
    const { content, parentId, nodeId } = req.body
    const projectId = getParam(req.params.projectId)
    const userId = req.user!.userId

    const comment = await service.addComment(
        content,
        projectId,
        userId,
        parentId,
        nodeId
    )

    res.json(comment)
}

export const getProjectComments = async (req: Request, res: Response) => {
    const projectId = getParam(req.params.projectId)

    const comments = await service.fetchProjectComments(projectId)

    res.json(comments)
}

export const getNodeComments = async (req: Request, res: Response) => {
    const nodeId = getParam(req.params.nodeId)

    const comments = await service.fetchNodeComments(nodeId)

    res.json(comments)
}