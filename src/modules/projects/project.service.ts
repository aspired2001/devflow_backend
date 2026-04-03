import { prisma } from "../../config/db"

export const createProject = async (
    name: string,
    userId: string
) => {
    return prisma.project.create({
        data: { name, ownerId: userId }
    })
}

export const listProjects = async (userId: string) => {
    return prisma.project.findMany({
        where: { ownerId: userId }
    })
}

export const deleteProject = async (
    id: string,
    userId: string
) => {
    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project || project.ownerId !== userId) {
        throw new Error("Unauthorized")
    }

    return prisma.project.delete({
        where: { id }
    })
}

export const updateProject = async (
    id: string,
    name: string,
    userId: string
) => {
    if (!name || name.trim() === "") {
        throw new Error("Invalid project name")
    }

    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project || project.ownerId !== userId) {
        throw new Error("Unauthorized")
    }

    return prisma.project.update({
        where: { id },
        data: { name }
    })
}