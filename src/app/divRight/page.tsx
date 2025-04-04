"use client";
import { CustomInput } from '@/components/generic-inputs/inputs';
import { states } from '@/store-redux/states';
import React from 'react';

export const DivRight = () => {
    const { data } = states.getInitialState();
    console.log('Dati iniziali a destra: ', data.BMR)

    return (
        <div className="">
            <div className="top">
                <div className="results">
                    {data.BMR.map((bmr, index: number) => {
                        return (
                            <>
                                <CustomInput key={index} type="text" placeholder='weight' name='weight' value={bmr.weight} readonly={true} />
                                <CustomInput key={index} type="text" placeholder='height' name='height' value={bmr.height} readonly={true} />
                                <CustomInput key={index} type="text" placeholder='age' name='age' value={bmr.age} readonly={true} />
                            </>
                        )
                    })
                    }
                </div>
            </div>
            <div className="bottom"></div>
        </div>
    )
}