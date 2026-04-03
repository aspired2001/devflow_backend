import { Server, Socket } from "socket.io"
import { pub, sub } from "../config/redis"

export const registerDiagramHandlers = (
    io: Server,
    socket: Socket
) => {

    // 🔹 Join room
    socket.on("join_project", (projectId: string) => {
        socket.join(projectId)
    })

    // 🔹 Publish updates to Redis (NOT directly emit)
    socket.on("diagram_update", ({ projectId, data }) => {
        // pub.publish(
        //     "diagram_updates",
        //     JSON.stringify({ projectId, data })
        // )

        socket.to(projectId).emit("diagram_update", data)
    })

    // 🔹 Cursor tracking (no Redis needed)
    socket.on("cursor_move", ({ projectId, cursor }) => {
        socket.to(projectId).emit("cursor_move", {
            userId: socket.id,
            cursor
        })
    })
}