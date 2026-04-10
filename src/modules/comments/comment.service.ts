import * as repo from "./comment.repository"

export const addComment = async (
    content: string,
    projectId: string,
    userId: string,
    parentId?: string,
    nodeId?: string
) => {
    return repo.createComment({
        content,
        projectId,
        userId,
        parentId,
        nodeId
    })
}

export const fetchProjectComments = (projectId: string) => {
    return repo.getCommentsByProject(projectId)
}

export const fetchNodeComments = (nodeId: string) => {
    return repo.getCommentsByNode(nodeId)
}