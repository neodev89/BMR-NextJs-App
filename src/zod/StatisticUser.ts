import { z } from "zod";

export const StatisticUserSchema = z.object({
    token: z.string().nonempty(),
    email: z.string().nonempty(),
    name: z.string().nonempty(),

    // Liste di valori numerici
    list_weight: z.array(z.number()),
    list_height: z.array(z.number()),
    list_age: z.array(z.number().int()), // Età come interi
    list_activity: z.array(z.string()).nonempty(),
    list_bmr: z.array(z.number()),

    // Medie come numeri float/int
    average_weight: z.number(),
    average_height: z.number(),
    average_age: z.number(),
    average_activity: z.string().nonempty(),
    average_bmr: z.number(),

    creations_date: z.string(),
    list_order: z.array(z.number()),
});

export const RowsStatisticUser = z.object({
    email: z.string().nonempty(),
    name: z.string().nonempty(),

    // Liste di valori numerici
    list_weight: z.array(z.number()),
    list_height: z.array(z.number()),
    list_age: z.array(z.number().int()), // Età come interi
    list_activity: z.array(z.string()).nonempty(),
    list_bmr: z.array(z.number()),

    // Medie come numeri float/int
    average_weight: z.number(),
    average_height: z.number(),
    average_age: z.number(),
    average_activity: z.string().nonempty(),
    average_bmr: z.number(),

    creations_date: z.string(),
    list_order: z.array(z.number()),
});

export type StatisticUserTypes = z.infer<typeof StatisticUserSchema>;
export type RowsStatisticTypes = z.infer<typeof RowsStatisticUser>;