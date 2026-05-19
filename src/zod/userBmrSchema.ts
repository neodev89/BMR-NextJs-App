import z from "zod";

export const userBmrDbSchema = z.object({
    id: z.number().nonnegative(),
    createdAt: z.string().nonempty(),
    userName: z.string().nonempty(),
    weight: z.string().nonempty(),
    height: z.string().nonempty(),
    age: z.string().nonempty(),
    activity: z.string().nonempty(),
    bmr: z.string().nonempty(),
    gender: z.string().nullable(),
    tokenUser: z.string().nonempty()
});

export const bmrSchema = z.object({
    height: z.string(),
    weight: z.string(),
    age: z.string(),
    activity: z.string().nonempty(),
    gender: z.string(),
    bmr: z.string().nonempty(),
});

export type bmrType = z.infer<typeof bmrSchema>;
export type userBmrDbType = z.infer<typeof userBmrDbSchema>;
