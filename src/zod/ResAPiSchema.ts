import { z } from "zod";

export const ResApiSchema = <T extends z.ZodType>(d: T) =>
    z.object({
        success: z.boolean().nonoptional(),
        message: z.string().nonoptional(),
        data: d,
        status: z.number().nonnegative().nonoptional(),
    });

export type ResApiType<T extends z.ZodType> = z.infer<ReturnType<typeof ResApiSchema<T>>>;

export const controlTypeResApi = async <T extends z.ZodTypeAny>(
    schema: T,
    data: unknown
) => {
    const resSchema = ResApiSchema(schema);
    return await resSchema.parseAsync(data);
};