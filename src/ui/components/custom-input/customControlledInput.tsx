import { controlledInputProps, controlledIterateFieldProps } from "@/src/@types/inputType";
import { Controller, Path } from "react-hook-form"

export const ControlledInput = <T extends object>({
    control, name, type, values
}: controlledInputProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <input type={type} value={String(values)} onChange={field.onChange} />
            )}
        />
    )
};

{/** Questo Component funziona perfettamente e finalmente fa ciò per cui
    è nato: iterare un array di elementi e restituire react hook form perfettamente
    connesso alle props passate
*/}
export const ControlledIteratedInput = <T extends object>({
    control,
    values,
    type
}: controlledIterateFieldProps<T>) => {

    const valueArr = Array.isArray(values as T) ? (values as T) : [(values as T)];

    const inferType = (key: string, value: T):
        "number" | "text" | "email" | "password" | "date" | undefined => {

        // date (Date object)
        if (value instanceof Date) return "date";

        // date (string con pattern ISO o locale)
        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/.test(value)
        ) return "date";

        // number
        if (typeof value === "number") return "number";

        // string
        if (typeof value === "string") return "text";

        return undefined;
    };

    return (
        <div className="flex flex-wrap h-auto w-full">
            {(valueArr as Array<T>).map((el: T, idx: number) => {
                console.log(valueArr);
                return Object.entries(el).map(([key, value], entryIdx) => {

                    const dynamicType =
                        type[entryIdx] ??
                        inferType(key, value) ??
                        "text";

                    const fieldName = `${key}` as Path<T>;

                    const formatDate = () => {
                        // input: 2026-08-14T12:00:00Z
                        if (key === "created_at" || key === "creation_date") {
                            console.log("le chiavi sono: ", key);
                            const splittedDate = value.split("T")
                            console.log(splittedDate[0]);
                            const dateNoFormat = splittedDate[0].split("-");
                            const y = dateNoFormat[0];
                            const m = dateNoFormat[1];
                            const d = dateNoFormat[2];
                            const newDate = `${y}-${m}-${d}`;
                            console.log("La nuova data da apporre è: ", newDate)
                            return newDate;
                        } else {
                            return value;
                        }
                    };

                    return (
                        <ControlledInput
                            key={`${idx}-${key}`}
                            control={control}
                            name={fieldName}
                            type={dynamicType}
                            values={formatDate()}
                        />
                    );
                });
            })}
        </div>
    );
};
