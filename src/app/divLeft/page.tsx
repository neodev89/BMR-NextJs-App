"use client";
import { useState, useEffect } from 'react';
import './left.sass';

export const DivLeft = () => {
    const [input, setInput] = useState<{ [key: string]: string }>({
        weight: "",
        height: "",
        age: ""
    });

    const [gender, setGender] = useState<boolean>(false);
    const [isGender, setIsGender] = useState<string>("");

    const handleGender = () => {
        setGender(!gender);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput(
            prev => ({
                ...prev,
                [name]: value
            })
        );
    }

    useEffect(() => {
        function impostaGender() {
            const Gender = !gender ? setIsGender("maschio") : setIsGender("femmina");
            console.log(`il sesso selezionato è ${isGender}`);
            console.log(gender);
            return Gender;
        }
        impostaGender();
    }, [gender, isGender]);

    return (
        <div className="flex h-1/3 w-full">
            <form method="POST" action="/save-data">
                <fieldset>
                    <input type="text" name="weight" id="weight" onChange={handleChange} value={input.weight} />
                    <input type="text" name="height" id="height" onChange={handleChange} value={input.height} />
                    <input type="text" name="age" id="age" onChange={handleChange} value={input.age} />
                </fieldset>
                <div className="buttons">
                    <input type="submit" value="Invia" />
                    <button type="button" onClick={handleGender}>Sesso</button>
                </div>
            </form>
        </div>
    )
}