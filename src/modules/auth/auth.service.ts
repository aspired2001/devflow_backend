import { prisma } from "../../config/db"
import { hashPassword, comparePassword } from "../../utils/hash"
import { generateToken } from "../../utils/jwt"

export const signup = async (email: string, password: string) => {
    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
        data: { email, password: hashed }
    })

    return generateToken(user.id)
}

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new Error("User not found")

    const valid = await comparePassword(password, user.password)

    if (!valid) throw new Error("Invalid password")

    return generateToken(user.id)
}