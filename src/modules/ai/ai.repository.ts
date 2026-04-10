import { prisma } from "../../config/db"

export const findExisting = (projectId: string, hash: string) => {
    return prisma.aiReview.findFirst({
        where: { projectId, hash, status: "completed" }
    })
}

export const createJob = (projectId: string, hash: string) => {
    return prisma.aiReview.create({
        data: {
            projectId,
            hash,
            status: "pending"
        }
    })
}

export const completeJob = (id: string, result: any) => {
    return prisma.aiReview.update({
        where: { id },
        data: { result, status: "completed" }
    })
}

export const failJob = (id: string) => {
    return prisma.aiReview.update({
        where: { id },
        data: { status: "failed" }
    })
}