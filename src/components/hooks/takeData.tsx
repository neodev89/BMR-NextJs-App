"use client";
import { BmrType, dataProps } from "@/@types/bmr-type";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useTakeData = () => {
    const [data, setData] = useState<dataProps>({
        method: "",
        BMR: [], // Array vuoto iniziale
    });
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [resOk, setResOk] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Response is ", resOk);
        console.log("isFetching is ", isFetching);
        console.log("Is there a error in my code? ", error);
    }, [resOk, data, error, isFetching])

    const fetchData = async () => {
        try {
            setIsFetching(true);
            const response: Response = await fetch("/api/take-data", {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });
            if (!response.ok) {
                setError("Errore durante la richiesta API");
                setResOk(false);
                console.error("Errore nella 'response': ", response.statusText);
                return;
            } else {
                const result: BmrType = await response.json();
                setData(result.data);
                console.log("Ci sono i dati: ", result.data);
                setIsFetching(false);
                return result.data;
                // const result : Promise<BmrType> = response.json();
                // if (await result) {
                //     console.log("Ci sono i dati: ", result);
                //     setData(await result);
                //     setIsFetching(false);
                // } else {
                //     console.error("Nessun dato è stato recuperato!");
                // }
            }
        } catch (error) {
            setError("Errore durante la fetch")
            console.error(error);
        }
    }
    return { data, isFetching, error, resOk, fetchData };
}