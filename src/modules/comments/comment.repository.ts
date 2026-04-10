import { prisma } from "../../config/db"


export const createComment = (data: any) => {
    return prisma.comment.create({ data })
}

export const getCommentsByProject = (projectId: string) => {
    return prisma.comment.findMany({
        where: { projectId, parentId: null },
        include: {
            replies: true
        },
        orderBy: { createdAt: "asc" }
    })
}

export const getCommentsByNode = (nodeId: string) => {
    return prisma.comment.findMany({
        where: { nodeId, parentId: null },
        include: {
            replies: true
        }
    })
}