import { Server } from "socket.io"
import { Server as HTTPServer } from "http"
import { registerDiagramHandlers } from "./diagram.socket"
import { sub } from "../config/redis"

export const initSocket = (server: HTTPServer) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    })

    io.on("connection", (socket) => {
        registerDiagramHandlers(io, socket)
    })

    sub.subscribe("diagram_updates")

    sub.on("message", (channel: string, message: string) => {
        const { projectId, data } = JSON.parse(message)
        io.to(projectId).emit("diagram_update", data)
    })

    return io
}