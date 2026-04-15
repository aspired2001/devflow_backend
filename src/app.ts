import express from "express"
import cors from "cors"
import routes from "./routes"
import { errorHandler } from "./middlewares/error.middleware"

const app = express()

app.use(cors())
app.use(express.json())

// ✅ ADD THIS HERE
app.get("/health", (req, res) => {
    res.status(200).send("OK")
})

app.use("/api", routes)

app.use(errorHandler)

export default app