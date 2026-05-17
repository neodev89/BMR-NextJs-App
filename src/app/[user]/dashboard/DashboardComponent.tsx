'use client'

import calcBmr from "@/src/formule/calcBmr";
import CustomInput from "@/src/ui/components/CustomInput";
import CloseIcon from '@mui/icons-material/Close';

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { Path, useForm, useWatch } from "react-hook-form";
import { useCustomDeleteMutation } from "@/src/tanstack/api/useDelete";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BasicMenu from "@/src/ui/components/menu/Menu";
import { bmrSchema, bmrType, userBmrDbType } from "@/src/zod/userBmrSchema";
import { useCustomMutation } from "@/src/tanstack/api/usePost";

const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});

export default function DashboardComponent() {
    const defaultState = {
        height: "",
        weight: "",
        age: "",
    };
    const [gender, setGender] = useState<"M" | "F">("M");
    const [selectActivity, setSelectActivity] = useState<"Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta">("Sedentario");
    const [bmr, setBmr] = useState<string>("0");

    const { control, handleSubmit, setValue, reset } = useForm<bmrType>({
        defaultValues: defaultState,
        resolver: zodResolver(bmrSchema),
    });

    const router = useRouter();

    const escape = useCustomDeleteMutation<string>(["escape-delete-cookies"]);
    const userBmr = useCustomMutation<bmrType, userBmrDbType>(["save-user-bmr"]);

    const deleteItem = (name: Path<bmrType>) => {
        setValue(name, "");
    };

    const height = useWatch({
        control,
        name: "height"
    });
    const weight = useWatch({
        control,
        name: "weight"
    });
    const age = useWatch({
        control,
        name: "age"
    });

    const handleGender = () => {
        setGender(prev => prev === "M" ? "F" : "M");
    };


    const values = useWatch({ control });

    const allFilled = Object.values(values).every(v => v === "");

    const handleCalculated = () => {
        const res = calcBmr({ height, weight, age, selectActivity, gender });
        console.log(`Calcolo eseguito su gender ${gender}: `, res);
        if (res === 0) {
            setBmr("0");
        }
        setBmr((res).toFixed(2));
    };

    const handleResetBmr = () => {
        setBmr("0");
        reset({
            height: "",
            weight: "",
            age: ""
        });
        setSelectActivity("Sedentario");
    };

    const handleEsc = async () => {
        try {
            const res = await escape.mutateAsync({
                url: "/api/cookies",
            });
            if (res.status === 500) return;
            router.push("/login");
        } catch (error) {
            console.log("Errore nella DELETE: ", error);
            return;
        }
    }

    const activities: Array<"Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta"> = [
        "Sedentario",
        "Leggermente attivo",
        "Moderatamente attivo",
        "Molto attivo",
        "Atleta",
    ];

    return (
        <LazyGlobalWrapper>
            <div className="dashboard">
                <div className="relative flex flex-row h-20 w-full">
                    <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        onClick={handleEsc}
                        sx={{
                            height: "2.5rem",
                            maxWidth: "12rem",
                        }}
                    >
                        Esci
                    </Button>
                </div>
                <div className="bmr">
                    {/** Qui andranno due tabelle sulla riga identica */}
                    <div className="cards">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>BMR</p>
                            </div>
                            <form>
                                <div className="body_cards">
                                    <CustomInput
                                        control={control}
                                        name={"height"}
                                        deleteItem={deleteItem}
                                        placeholder="height in cm"
                                    />
                                    <CustomInput
                                        control={control}
                                        name={"weight"}
                                        deleteItem={deleteItem}
                                        placeholder="weight in kg"
                                    />
                                    <CustomInput
                                        control={control}
                                        name={"age"}
                                        deleteItem={deleteItem}
                                        placeholder="age"
                                    />
                                    <BasicMenu items={activities} value={selectActivity} setValue={setSelectActivity} />
                                    <Box sx={{
                                        position: "relative",
                                        display: "flex",
                                        height: "auto",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Button
                                            type="button"
                                            color="primary"
                                            variant="outlined"
                                            disabled={allFilled}
                                            sx={{
                                                height: "2.5rem",
                                                maxWidth: "80%",
                                            }}
                                            onClick={handleCalculated}
                                        >
                                            Calcola
                                        </Button>
                                    </Box>
                                    <Box sx={{
                                        position: "relative",
                                        display: "flex",
                                        height: "auto",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        {bmr}
                                        {(bmr !== "0" || !bmr) && <IconButton
                                            onClick={handleResetBmr}
                                        >
                                            <CloseIcon color="error" />
                                        </IconButton>}
                                    </Box>
                                </div>
                            </form>
                            <div className="footer_cards">
                                <Button
                                    type="button"
                                    sx={{
                                        height: "2.5rem",
                                        maxWidth: "80%",
                                        backgroundColor: `${gender === "M" ? "primary" : red[400]}`
                                    }}
                                    variant="contained"
                                    onClick={handleGender}>
                                    Scegli il genere {gender}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="cards">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>ICM</p>
                            </div>
                            <div className="body_cards"></div>
                            <div className="footer_cards"></div>
                        </div>
                    </div>
                </div>
                <div>
                    {/** non ho deciso cosa mettere */}
                </div>
            </div>
        </LazyGlobalWrapper>
    )
};