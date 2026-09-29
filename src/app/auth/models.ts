import {z} from "zod"

export const signUpPayloadModel = z.object({
    firstName : z.string().min(2),
    lastName: z.string().nullable().optional(),
    email: z.email(),
    password: z.string().min(8)
})