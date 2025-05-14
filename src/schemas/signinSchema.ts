import {z} from "zod";



export const signinSchema = z.object({
    identifier: z.string().email({message: "invalid username or email address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"}).max(15, {message: "password must not be greater than 15 characters"})
})