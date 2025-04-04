import React from 'react';
import './CustomInputStyle.sass';
import { CustomInputProps } from '@/@types/bmr-type';

export const CustomInput = ({ data, type, onChange, ...other }: CustomInputProps) => {
    return (
        <div className="custom-input">
            { data.map((bmr, index) => {
                return (
                    <input
                        key={index}
                        type={type}
                        className="inputs"
                        onChange={onChange}
                        {...other}
                    />
                )
            })}
        </div>
    )
}