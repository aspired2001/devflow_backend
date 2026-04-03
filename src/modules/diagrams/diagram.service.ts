import { prisma } from "../../config/db"
import { ApiError } from "../../utils/ApiError"

export const createDiagramIfNotExists = async (projectId: string) => {
    let diagram = await prisma.diagram.findUnique({
        where: { projectId }
    })

    if (!diagram) {
        diagram = await prisma.diagram.create({
            data: { projectId }
        })
    }

    return diagram
}

export const saveVersion = async (projectId: string, data: any) => {
    const diagram = await createDiagramIfNotExists(projectId)

    const last = await prisma.version.findFirst({
        where: { diagramId: diagram.id },
        orderBy: { version: "desc" }
    })

    const nextVersion = (last?.version || 0) + 1

    return prisma.version.create({
        data: {
            diagramId: diagram.id,
            version: nextVersion,
            data: data as any 
        }
    })
}

export const getLatestDiagram = async (projectId: string) => {
    return prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { version: "desc" },
                take: 1
            }
        }
    })
}

export const getVersions = async (projectId: string) => {
    const diagram = await prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { version: "desc" }
            }
        }
    })

    return diagram?.versions
}

export const restoreVersion = async (versionId: string, userId: string) => {
    const version = await prisma.version.findUnique({
        where: { id: versionId },
        include: {
            diagram: {
                include: {
                    project: true
                }
            }
        }
    })

    if (!version) throw new ApiError(404, "Version not found")

    if (version.diagram.project.ownerId !== userId) {
        throw new ApiError(403, "Forbidden")
    }

    const last = await prisma.version.findFirst({
        where: { diagramId: version.diagramId },
        orderBy: { version: "desc" }
    })

    const nextVersion = (last?.version || 0) + 1

    return prisma.version.create({
        data: {
            diagramId: version.diagramId,
            version: nextVersion,
            data: version.data as any
        }
    })
}

export const getStats = async (userId: string) => {
    const totalProjects = await prisma.project.count({
        where: { ownerId: userId }
    })

    const totalVersions = await prisma.version.count({
        where: {
            diagram: {
                project: {
                    ownerId: userId
                }
            }
        }
    })

    return {
        totalProjects,
        totalVersions
    }
}