import z from "zod";

export const userBmrDbSchema = z.object({
    id: z.number().nonnegative(),
    created_at: z.string().nonempty(),
    user_name: z.string().nonempty(),
    weight: z.string().nonempty(),
    height: z.string().nonempty(),
    age: z.string().nonempty(),
    activity: z.string().nonempty(),
    bmr: z.string().nonempty(),
    gender: z.string().nullable(),
    token_user: z.string().nonempty(),
    order: z.number().default(-1).nonoptional(),
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
