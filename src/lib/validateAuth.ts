import { object, string, email, z } from "zod"

export const signInSchema = object({
    email: email("Invalid email"),
    password: string({ message: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export type signInType = z.infer<typeof signInSchema>;