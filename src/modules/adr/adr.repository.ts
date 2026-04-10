import { prisma } from "../../config/db"

export const createADR = (data: any) => {
    return prisma.adr.create({ data })
}

export const getProjectADR = (projectId: string) => {
    return prisma.adr.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" }
    })
}

export const updateADR = (id: string, data: any) => {
    return prisma.adr.update({
        where: { id },
        data
    })
}