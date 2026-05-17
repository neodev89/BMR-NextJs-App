import z from "zod";

export const userBmrDbSchema = z.object({
    id: z.number().nonnegative(),
    createdAt: z.string().nonempty(),
    userName: z.string().nonempty(),
    weight: z.string().nonempty(),
    height: z.string().nonempty(),
    age: z.string().nonempty(),
    tokenUser: z.string().nonempty()
});

export const bmrSchema = z.object({
    height: z.string(),
    weight: z.string(),
    age: z.string(),
});

export type bmrType = z.infer<typeof bmrSchema>;
export type userBmrDbType = z.infer<typeof userBmrDbSchema>;
