import type { Request, Response } from "express"
import { signUpPayloadModel, sigInPayloadModel } from "./models.js"
import { db } from "../../db/index.js"
import { usersTable } from "../../db/schema.js"
import { eq } from "drizzle-orm"
import { createHmac, randomBytes } from "node:crypto"
import { createToken } from "./utils/token.js"

class AuthenticationController {
    public async handleSignUp(req: Request, res: Response) {
        const validationResult = await signUpPayloadModel.safeParseAsync(req.body)
        if (validationResult.error) return res.status(400).json(
            { message: "body validation failed", error: validationResult.error.issues }
        )

        const { firstName, lastName, email, password } = validationResult.data
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (userEmailResult.length > 0) return res.status(400).json(
            { message: `User with email ${email} already exists`, error: "dupplicate entry" }
        )

        const salt = randomBytes(32).toString("hex")
        const hash = createHmac('sha256', salt).update(password).digest("hex")

        const [insertUserDataIntoDB] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: usersTable.id })

        return res.status(200).json({
            message: "user has been created successsfully", data: { id: insertUserDataIntoDB?.id }
        })
    }


    public async handleSignIn(req: Request, res: Response) {
        const validationResult = await sigInPayloadModel.safeParseAsync(req.body)
        if (validationResult.error) return res.status(400).json(
            { message: "body validation failed", error: validationResult.error.issues }
        )

        const {email, password} = validationResult.data
        const [selectedUser] = await db.select().from(usersTable).where(eq(usersTable.email, email))
        
        
        if (!selectedUser) return res.status(404).json({ message: `user with email ${email} does not exists` })
        
        const salt = selectedUser.salt!
        const hash = createHmac('sha256', salt).update(password).digest("hex")

        if(selectedUser.password !== hash) return res.status(400).json(
            {message: `email or password is incorrect`}
        )

        const token = createToken({id: selectedUser.id})
        return res.status(200).json({message: "Sign in success", data: {token}})
    }
}


export default AuthenticationController