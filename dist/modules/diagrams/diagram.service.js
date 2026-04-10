"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.restoreVersion = exports.getVersions = exports.getLatestDiagram = exports.saveVersion = exports.createDiagramIfNotExists = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const cache_1 = require("../../utils/cache");
const createDiagramIfNotExists = async (projectId) => {
    let diagram = await db_1.prisma.diagram.findUnique({
        where: { projectId }
    });
    if (!diagram) {
        diagram = await db_1.prisma.diagram.create({
            data: { projectId }
        });
    }
    return diagram;
};
exports.createDiagramIfNotExists = createDiagramIfNotExists;
// ✅ FIXED: Race condition + cache invalidation
const saveVersion = async (projectId, data) => {
    return db_1.prisma.$transaction(async (tx) => {
        let diagram = await tx.diagram.findUnique({
            where: { projectId }
        });
        if (!diagram) {
            diagram = await tx.diagram.create({
                data: { projectId }
            });
        }
        const last = await tx.version.findFirst({
            where: { diagramId: diagram.id },
            orderBy: { version: "desc" }
        });
        const nextVersion = (last?.version || 0) + 1;
        const created = await tx.version.create({
            data: {
                diagramId: diagram.id,
                version: nextVersion,
                data: data
            }
        });
        // ✅ CRITICAL: invalidate cache after write
        await (0, cache_1.deleteCache)(`diagram:${projectId}`);
        return created;
    });
};
exports.saveVersion = saveVersion;
const getLatestDiagram = async (projectId) => {
    const cacheKey = `diagram:${projectId}`;
    // ✅ STEP 1: Check cache FIRST
    const cached = await (0, cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    // ✅ STEP 2: Fetch from DB
    const diagram = await db_1.prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { version: "desc" },
                take: 1
            }
        }
    });
    // ✅ STEP 3: Store in cache
    if (diagram) {
        await (0, cache_1.setCache)(cacheKey, diagram, 60);
    }
    return diagram;
};
exports.getLatestDiagram = getLatestDiagram;
const getVersions = async (projectId) => {
    const diagram = await db_1.prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { version: "desc" }
            }
        }
    });
    return diagram?.versions;
};
exports.getVersions = getVersions;
// ✅ FIXED: Race condition + cache invalidation
const restoreVersion = async (versionId, userId) => {
    return db_1.prisma.$transaction(async (tx) => {
        const version = await tx.version.findUnique({
            where: { id: versionId },
            include: {
                diagram: {
                    include: {
                        project: true
                    }
                }
            }
        });
        if (!version)
            throw new ApiError_1.ApiError(404, "Version not found");
        if (version.diagram.project.ownerId !== userId) {
            throw new ApiError_1.ApiError(403, "Forbidden");
        }
        const last = await tx.version.findFirst({
            where: { diagramId: version.diagramId },
            orderBy: { version: "desc" }
        });
        const nextVersion = (last?.version || 0) + 1;
        const created = await tx.version.create({
            data: {
                diagramId: version.diagramId,
                version: nextVersion,
                data: version.data
            }
        });
        // ✅ CRITICAL: invalidate cache after restore
        await (0, cache_1.deleteCache)(`diagram:${version.diagram.projectId}`);
        return created;
    });
};
exports.restoreVersion = restoreVersion;
const getStats = async (userId) => {
    const totalProjects = await db_1.prisma.project.count({
        where: { ownerId: userId }
    });
    const totalVersions = await db_1.prisma.version.count({
        where: {
            diagram: {
                project: {
                    ownerId: userId
                }
            }
        }
    });
    return {
        totalProjects,
        totalVersions
    };
};
exports.getStats = getStats;
//# sourceMappingURL=diagram.service.js.map