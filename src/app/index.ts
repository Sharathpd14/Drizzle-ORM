import express from "express"
import type { Express } from "express"
import { authRouter } from "./auth/routes.js"
import { authenticationMiddleware } from "./auth/middleware/auth-middleware.js"

export function createExpressApplication(): Express {
    const app = express()
    app.use(express.json())
    app.use(authenticationMiddleware())
    
    app.get("/health", (req,res)=>{
        return res.json({message : "Welcome to adha's AI"})
    })
    
    app.use("/auth", authRouter)

    return app
}