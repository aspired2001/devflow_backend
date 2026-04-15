import { execSync } from "child_process"
execSync("npx prisma migrate deploy", { stdio: "inherit" })

import http from "http"
import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import { initSocket } from "./sockets"

const server = http.createServer(app)

initSocket(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})