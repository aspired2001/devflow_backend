import { Server, Socket } from "socket.io"
import { pub } from "../config/redis"

export const registerDiagramHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("join_project", (projectId: string) => {
        socket.join(projectId)
    })

    socket.on("diagram_update", ({ projectId, data }) => {
        pub.publish(
            "diagram_updates",
            JSON.stringify({ projectId, data })
        )
    })

    socket.on("cursor_move", ({ projectId, cursor }) => {
        socket.to(projectId).emit("cursor_move", {
            userId: socket.id,
            cursor
        })
    })
}