import * as React from 'react';
import './style.sass';

interface InputType {
    type: string;
    value: string;
    name: string;
    id?: string;
    className?: string;
    placeholder?: string;
    readonly?: boolean;
    min?: string;
    max?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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