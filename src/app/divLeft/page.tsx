"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { states, update } from '@/store-redux/states';
import './left.sass';
import { useTakeData } from '@/components/hooks/takeData';
import { dataProps, ObjProps } from '@/@types/bmr-type';

export const DivLeft = () => {
    const { data, error, isFetching, fetchData } = useTakeData();

    const [count, setCount] = useState<number>(-1);
    const [input, setInput] = useState<ObjProps>({
        id: count.toString(),
        utente: "",
        weight: "",
        height: "",
        age: "",
    })

    const dispatch = useDispatch();

    const [gender, setGender] = useState<boolean>(false);
    const [isGender, setIsGender] = useState<string>("");

    const handleGender = () => {
        setGender(!gender);
    }

    const handleCount = () => {
        if (count === -1) {
            setCount(count + 1);
            console.log(count);
            return count;
        } else {
            return count;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            id: "",
            utente: "Caio",
        }));

        // Successivamente verifica lo stato
        setInput(prev => {
            if (prev.utente !== '') {
                return {
                    ...prev,
                    [name]: value,
                };
            } else {
                console.error("Dati non caricati completamente");
                return prev;
            }
        });
        // In questo modo semplifica il salvataggio dei dati e consente 
        // di salvare tutte le info in un'unica funzione
    }

    const handleSaveData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(update({
            BMR: [{ ...input }],
        }));
    }

    useEffect(() => {
        const Gender = (gender === true) ? setIsGender("maschio") : setIsGender("femmina");
        console.log(gender);
        console.log(`il sesso selezionato è ${isGender}`);
    }, [gender, isGender]);

    useEffect(() => {
        async function fetchFunc() {
            await fetchData();
        }
        fetchFunc();
    }, []);

    useEffect(() => {
        console.log(data);
        console.log(count);

    }, [data, count]);

    return (
        <div className="flex h-1/3 w-full">
            <form method="POST" action="/api/save-data" onSubmit={(e) => handleSaveData(e)} >
                <fieldset className="fieldset">
                    {
                        !isFetching ? (
                            <div className='div-field'>
                                {
                                    data ?
                                        (
                                            <>
                                                {data.BMR.map((el) => {
                                                    return (
                                                        <>
                                                            <input type="text" name="weight" key={`0`} value={input.weight} placeholder="weight" onChange={(e) => handleChange(e)} />
                                                            <input type="text" name="height" key={`1`} value={input.height} placeholder="height" onChange={(e) => handleChange(e)} />
                                                            <input type="text" name="age" key={`2`} value={input.age} placeholder="age" onChange={(e) => handleChange(e)} />
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )
                                        :
                                        (
                                            <span>I dati non ci sono</span>
                                        )
                                }
                            </div>
                        ) : (
                            <span>Sta caricando...</span>
                        )
                    }
                </fieldset>
                <div className="buttons">
                    <input type="submit" value="Invia" />
                    <button type="button" className={gender ? "male" : "female"} onClick={handleGender}>Sesso</button>
                </div>
            </form>
        </div >
    )
} 