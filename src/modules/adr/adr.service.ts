import * as repo from "./adr.repository"

export const createADR = (
    projectId: string,
    userId: string,
    data: any
) => {
    return repo.createADR({
        ...data,
        projectId,
        createdById: userId,   // ← was "createdBy" — must match the scalar FK field name in the schema
    })
}

export const listADR = (projectId: string) => {
    return repo.getProjectADR(projectId)
}

export const updateADR = (id: string, data: any) => {
    return repo.updateADR(id, data)
}