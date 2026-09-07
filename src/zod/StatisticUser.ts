import { z } from "zod";
import { controlEmail } from "./controlLogin";

export const StatisticUserSchema = z.object({
    token: z.string().nonempty(),
    email: z.string().nonempty(),
    name: z.string().nonempty(),
    list_weight: z.array(z.string()).nonempty(),
    list_height: z.array(z.string()).nonempty(),
    list_age: z.array(z.string()).nonempty(),
    list_activity: z.array(z.string()).nonempty(),
    list_bmr: z.array(z.string()).nonempty(),
    average_weight: z.string().nonempty(),
    average_height: z.string().nonempty(),
    average_age: z.string().nonempty(),
    average_activity: z.string().nonempty(),
    average_bmr: z.string().nonempty(),
    creation_date: z.string(),
    list_order: z.array(z.number()).nonoptional(),
});

export type StatisticUserTypes = z.infer<typeof StatisticUserSchema>