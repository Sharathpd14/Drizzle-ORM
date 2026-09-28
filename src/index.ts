import http from "node:http"
import { createExpressApplication } from "./app/index.js"

async function main() {
    try {
        const server = http.createServer(createExpressApplication())
        const PORT:number = 3000

        server.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
            
        })
    } catch (error) {
        console.log("Error while starting http server");
        throw error
        
    }
}

main()