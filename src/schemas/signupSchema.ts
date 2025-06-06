import {z} from "zod";


export const usernameValidation = z
    .string()
    .min(3, 'username must be atleast of 3 characters')
    .max(20, "username must be no more than 20 characters")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "invalid email address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"}).max(15, {message: "password must not be greater than 15 characters"})
})