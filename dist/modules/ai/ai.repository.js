"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failJob = exports.completeJob = exports.createJob = exports.findExisting = void 0;
const db_1 = require("../../config/db");
const findExisting = (projectId, hash) => {
    return db_1.prisma.aiReview.findFirst({
        where: { projectId, hash, status: "completed" }
    });
};
exports.findExisting = findExisting;
const createJob = (projectId, hash) => {
    return db_1.prisma.aiReview.create({
        data: {
            projectId,
            hash,
            status: "pending"
        }
    });
};
exports.createJob = createJob;
const completeJob = (id, result) => {
    return db_1.prisma.aiReview.update({
        where: { id },
        data: { result, status: "completed" }
    });
};
exports.completeJob = completeJob;
const failJob = (id) => {
    return db_1.prisma.aiReview.update({
        where: { id },
        data: { status: "failed" }
    });
};
exports.failJob = failJob;
//# sourceMappingURL=ai.repository.js.map