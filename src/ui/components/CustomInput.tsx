'use client'

import CloseIcon from '@mui/icons-material/Close';

import { Box, IconButton, SxProps, TextField, TextFieldProps, Theme, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { ReactNode } from "react";
import { Control, Controller, FieldValues, Path, RegisterOptions, UseFormSetValue } from 'react-hook-form';

type inputsProps<T extends object> = TextFieldProps & FieldValues & {
    control: Control<T>;
    name: Path<T>;
    deleteItem: (val: Path<T>) => void;
    icon?: ReactNode;
    key?: number | string;
    rules?: Omit<RegisterOptions<T, Path<T>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">;
    sx1?: SxProps<Theme>;
}

export default function CustomInput<T extends object>({
    control, name, rules, sx1, deleteItem, ...other
}: inputsProps<T>) {
    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'white',
            borderRadius: 2,
        }}>
            <Controller
                control={control}
                name={name}
                rules={rules ?? {}}
                render={({ field, fieldState }) => (
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    border: "none",
                                },
                                "&:hover fieldset": {
                                    border: "none",
                                },
                                "&.Mui-focused fieldset": {
                                    border: "none",
                                },
                                // ✅ questa è la chiave giusta
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "transparent !important",
                                },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent !important",
                            },
                            ...sx1,
                        }}

                        {...field}
                        label={other.label}
                        type={other.type}
                        fullWidth={other.fullWidth}
                        value={field.value ?? ""}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        onChange={(e) => {
                            const { value } = e.target;
                            field.onChange(value);
                        }}
                        placeholder={other.placeholder}
                        slotProps={{
                            inputLabel: {
                                shrink: undefined,
                                sx: {
                                    color: blue[700],
                                    fontWeight: 500,
                                    top: 0,
                                    '&.Mui-focused': {
                                        top: "7px",
                                    },
                                }
                            },
                            root: {
                                sx: {
                                    width: "80%",
                                    border: "none",
                                }
                            }
                        }}
                    />

                )}
            />
            <IconButton onClick={() => deleteItem(name)}>
                <CloseIcon color="error" />
            </IconButton>
        </Box>
    );
}