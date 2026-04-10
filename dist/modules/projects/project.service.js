"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = exports.deleteProject = exports.listProjects = exports.createProject = void 0;
const db_1 = require("../../config/db");
const createProject = async (name, userId) => {
    return db_1.prisma.project.create({
        data: { name, ownerId: userId }
    });
};
exports.createProject = createProject;
const listProjects = async (userId) => {
    return db_1.prisma.project.findMany({
        where: { ownerId: userId }
    });
};
exports.listProjects = listProjects;
const deleteProject = async (id, userId) => {
    const project = await db_1.prisma.project.findUnique({
        where: { id }
    });
    if (!project || project.ownerId !== userId) {
        throw new Error("Unauthorized");
    }
    return db_1.prisma.project.delete({
        where: { id }
    });
};
exports.deleteProject = deleteProject;
const updateProject = async (id, name, userId) => {
    if (!name || name.trim() === "") {
        throw new Error("Invalid project name");
    }
    const project = await db_1.prisma.project.findUnique({
        where: { id }
    });
    if (!project || project.ownerId !== userId) {
        throw new Error("Unauthorized");
    }
    return db_1.prisma.project.update({
        where: { id },
        data: { name }
    });
};
exports.updateProject = updateProject;
//# sourceMappingURL=project.service.js.map