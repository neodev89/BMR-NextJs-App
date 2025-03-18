import * as React from 'react';

interface InputType {
    type: string;
    value: string;
    name: string;
    id?: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = ({ type, name, value, onChange, ...other }: InputType) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...other}
        />
    )
}