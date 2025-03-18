"use client";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { update, reset } from '@/store-redux/states';
import { RootState } from '@/store-redux/Store';
import './left.sass';

interface InputState {
    weight: string;
    height: string;
    age: string;
}

export const DivLeft = () => {
    const [input, setInput] = useState<InputState>({
        weight: "",
        height: "",
        age: ""
    });

    const dispatch = useDispatch();

    // const weight = useSelector<RootState, string>((state) => state.state.weight);
    // const height = useSelector<RootState, string>((state) => state.state.height);
    // const age = useSelector<RootState, string>((state) => state.state.age);

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

    const handleSaveStore = () => {
        dispatch(update(input))
    }

    const handleSaveData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    useEffect(() => {
        const Gender = (gender === true) ? setIsGender("maschio") : setIsGender("femmina");
        console.log(gender);
        console.log(`il sesso selezionato è ${isGender}`);
    }, [gender]);

    return (
        <div className="flex h-1/3 w-full">
            <form method="POST" action="/save-data" onSubmit={(e) => handleSaveData(e)} >
                <fieldset>
                    <input type="text" name="weight" id="weight" onChange={handleChange} value={input.weight} />
                    <input type="text" name="height" id="height" onChange={handleChange} value={input.height} />
                    <input type="text" name="age" id="age" onChange={handleChange} value={input.age} />
                </fieldset>
                <div className="buttons">
                    <input type="submit" value="Invia" onClick={handleSaveStore}/>
                    <button type="button" className="gender" onClick={handleGender}>Sesso</button>
                </div>
            </form>
        </div>
    )
} 