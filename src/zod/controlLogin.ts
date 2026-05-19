import { z } from "zod";

const regexEmail = /^[a-zA-Z0–9. _%+-]+@[a-zA-Z0–9. -]+\. [a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-])[A-Za-z0-9!@#$%^&*()_+\-]+$/;

export const controEmail = z.email().nonempty().regex(regexEmail).min(2, { message: "minimo 4 caratteri" }).max(25, { message: "Lunghezza massima 25 caratteri" });
export const controlPassword = z.string().nonempty().regex(regexPassword).min(4, { message: "Minimo 4 caratteri" }).max(16, { message: "Massimo 16 caratteri" });

export const loginSchema = z.object({
    userName: z.string().min(5, { message: "inserire la mail" }),
    password: z.string().min(4, { message: "inserire la password di almeno 4 caratteri" }),
    name: z.string().min(2, { message: "minimo 2 caratteri" }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;