import http from "http"

import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import { initSocket } from "./sockets"

const server = http.createServer(app)

initSocket(server)

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})