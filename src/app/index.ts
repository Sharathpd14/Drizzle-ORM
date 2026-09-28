import express from "express"
import type { Express } from "express"


export function createExpressApplication(): Express {
    const app = express()


    app.get("/health", (req,res)=>{
        return res.json({message : "Welcome to adha's AI"})
    })
    return app
}