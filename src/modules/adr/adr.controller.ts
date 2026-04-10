import { Request, Response } from "express"
import * as service from "./adr.service"
import { getParam } from "../../utils/getParam"

export const createADR = async (req: Request, res: Response) => {
    const projectId = getParam(req.params.projectId)
    const userId = req.user!.userId

    const adr = await service.createADR(projectId, userId, req.body)

    res.json(adr)
}

export const listADR = async (req: Request, res: Response) => {
    const projectId = getParam(req.params.projectId)
    const adr = await service.listADR(projectId)

    res.json(adr)
}

export const updateADR = async (req: Request, res: Response) => {
    const id = getParam(req.params.id)

    const adr = await service.updateADR(id, req.body)

    res.json(adr)
}