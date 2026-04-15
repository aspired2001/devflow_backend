import express from "express"
import cors from "cors"
import routes from "./routes"
import { errorHandler } from "./middlewares/error.middleware"

import { Request, Response } from "express"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK")
})

app.use("/api", routes)

app.use(errorHandler)

export default app