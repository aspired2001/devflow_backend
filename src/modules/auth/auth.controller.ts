import { Request, Response } from "express"
import * as authService from "./auth.service"

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const token = await authService.signup(email, password)

    res.json({ token })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const token = await authService.login(email, password)

    res.json({ token })
}