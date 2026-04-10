"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByNode = exports.getCommentsByProject = exports.createComment = void 0;
const db_1 = require("../../config/db");
const createComment = (data) => {
    return db_1.prisma.comment.create({ data });
};
exports.createComment = createComment;
const getCommentsByProject = (projectId) => {
    return db_1.prisma.comment.findMany({
        where: { projectId, parentId: null },
        include: {
            replies: true
        },
        orderBy: { createdAt: "asc" }
    });
};
exports.getCommentsByProject = getCommentsByProject;
const getCommentsByNode = (nodeId) => {
    return db_1.prisma.comment.findMany({
        where: { nodeId, parentId: null },
        include: {
            replies: true
        }
    });
};
exports.getCommentsByNode = getCommentsByNode;
//# sourceMappingURL=comment.repository.js.map