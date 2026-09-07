import { Control, FieldValues, Path } from "react-hook-form";

export type controlledInputProps<T extends object> = FieldValues & {
    control: Control<T>;
    name: Path<T>;
    type: "text" | "number" | "email" | "password" | "date";
    values: unknown | Array<unknown>;
}

export type controlledIterateFieldProps<T extends object> = FieldValues & {
    control: Control<T>;
    values: unknown | Array<unknown>;
    type: Array<"text" | "number" | "email" | "password" | "date" | undefined>;
    name?: Path<T>;
}