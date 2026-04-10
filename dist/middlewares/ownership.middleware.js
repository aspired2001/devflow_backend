"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProjectOwnership = void 0;
const db_1 = require("../config/db");
const ApiError_1 = require("../utils/ApiError");
const checkProjectOwnership = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const projectId = (req.params.projectId || req.params.id);
        if (!projectId) {
            throw new ApiError_1.ApiError(400, "Project ID is required");
        }
        const project = await db_1.prisma.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new ApiError_1.ApiError(404, "Project not found");
        }
        if (project.ownerId !== userId) {
            throw new ApiError_1.ApiError(403, "Forbidden");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkProjectOwnership = checkProjectOwnership;
//# sourceMappingURL=ownership.middleware.js.map