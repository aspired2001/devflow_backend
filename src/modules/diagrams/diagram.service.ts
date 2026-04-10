import { prisma } from "../../config/db"
import { ApiError } from "../../utils/ApiError"
import { getCache, setCache, deleteCache } from "../../utils/cache"

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

// ✅ FIXED: Race condition + cache invalidation
export const saveVersion = async (projectId: string, data: any) => {
    return prisma.$transaction(async (tx) => {
        let diagram = await tx.diagram.findUnique({
            where: { projectId }
        })

        if (!diagram) {
            diagram = await tx.diagram.create({
                data: { projectId }
            })
        }

        const last = await tx.version.findFirst({
            where: { diagramId: diagram.id },
            orderBy: { version: "desc" }
        })

        const nextVersion = (last?.version || 0) + 1

        const created = await tx.version.create({
            data: {
                diagramId: diagram.id,
                version: nextVersion,
                data: data as any
            }
        })

        // ✅ CRITICAL: invalidate cache after write
        await deleteCache(`diagram:${projectId}`)

        return created
    })
}

export const getLatestDiagram = async (projectId: string) => {
    const cacheKey = `diagram:${projectId}`

    // ✅ STEP 1: Check cache FIRST
    const cached = await getCache(cacheKey)
    if (cached) return cached

    // ✅ STEP 2: Fetch from DB
    const diagram = await prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { version: "desc" },
                take: 1
            }
        }
    })

    // ✅ STEP 3: Store in cache
    if (diagram) {
        await setCache(cacheKey, diagram, 60)
    }

    return diagram
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

// ✅ FIXED: Race condition + cache invalidation
export const restoreVersion = async (versionId: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
        const version = await tx.version.findUnique({
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

        const last = await tx.version.findFirst({
            where: { diagramId: version.diagramId },
            orderBy: { version: "desc" }
        })

        const nextVersion = (last?.version || 0) + 1

        const created = await tx.version.create({
            data: {
                diagramId: version.diagramId,
                version: nextVersion,
                data: version.data as any
            }
        })

        // ✅ CRITICAL: invalidate cache after restore
        await deleteCache(`diagram:${version.diagram.projectId}`)

        return created
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