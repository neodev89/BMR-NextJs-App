import { z } from "zod";

export const newFoodSchema = z.object({
    nome: z.string().nonoptional(),
    calorie_100g: z.number().nonnegative(),
    unita: z.string().nonoptional(),
});

export const jsonFoodSchema = z.object({
    primi_e_cereali: z.array(newFoodSchema),
    carni_e_salumi: z.array(newFoodSchema),
    pesce_e_frutti_di_mare: z.array(newFoodSchema),
    latticini_e_formaggi: z.array(newFoodSchema),
    verdure_e_legumi: z.array(newFoodSchema),
    frutta: z.array(newFoodSchema),
    condimenti_e_grassi: z.array(newFoodSchema),
    dolci_e_colazioni: z.array(newFoodSchema),
});

export const jsonFileSchema = z.object({
    cibi_italiani_calorie_100g: jsonFoodSchema,
});

export type newFoodType = z.infer<typeof newFoodSchema>;
export type jsonFoodType = z.infer<typeof jsonFoodSchema>;
export type jsonFileType = z.infer<typeof jsonFileSchema>;