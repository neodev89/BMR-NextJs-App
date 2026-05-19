'use client'

import calcBmr from "@/src/formule/calcBmr";
import CustomInput from "@/src/ui/components/CustomInput";
import CloseIcon from '@mui/icons-material/Close';

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
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
    const [msgCalcBmr, setMsgCalcBmr] = useState<string>("");
    const [openSnack, setOpenSnack] = useState(false);
    const [severityAlert, setSeverityAlert] = useState<boolean>(false);


    const { control, setValue, reset } = useForm<bmrType>({
        defaultValues: defaultState,
        resolver: zodResolver(bmrSchema),
    });

    const router = useRouter();

    const escape = useCustomDeleteMutation<string>(["escape-delete-cookies"]);
    const updateBmr = useCustomMutation<bmrType, userBmrDbType>(["save-user-bmr"]);

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


    const values = useWatch({
        control,
    });
    const hasInvalidFields = Object.values(values ?? {}).some(v => {
        const s = String(v).trim();
        // 1. Controlla se è vuoto
        if (s === "") return true;
        // 2. Controlla se NON è un numero valido (solo cifre, una virgola o un punto)
        const isValidNumber = /^[0-9]+([.,][0-9]+)?$/.test(s);
        return !isValidNumber;
    });

    const handleCalculated = async () => {
        try {
            const res = calcBmr({ height, weight, age, selectActivity, gender });
            console.log(`Calcolo eseguito su gender ${gender}: `, res);
            if (res === 0) {
                setBmr("0");
            }
            setBmr((res).toFixed(2));
            const updateValueUser = await updateBmr.mutateAsync({
                url: "/api/save-bmr",
                body: { height, weight, age, activity: selectActivity, gender, bmr: (res).toFixed(2) }
            });
            if (updateValueUser.status === 500 || updateValueUser.status == 409 || updateValueUser.status === 404) {
                setMsgCalcBmr(updateValueUser.res.message);
                setSeverityAlert(updateValueUser.res.success);
            };
            setMsgCalcBmr(updateValueUser.res.message);
            setOpenSnack(updateValueUser.res.success);
            setSeverityAlert(updateValueUser.res.success);
        } catch (error: Error | unknown) {
            console.log("Errore nella chiamata API: ", error instanceof Error ? error.message : error);
        }
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
                <div className="relative flex flex-row h-auto bg-transparent w-full">
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleEsc}
                        sx={{
                            height: "2.5rem",
                            maxWidth: "12rem",
                            backgroundColor: "#7f22fe",
                        }}
                    >
                        Esci
                    </Button>
                </div>
                <div className="bmr">
                    {/** Qui andranno due tabelle sulla riga identica */}
                    <div className="cards gradient-border">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>BMR</p>
                            </div>
                            <form className="relative flex flex-row h-auto w-full">
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
                                        placeholder="weight in kg es 90.5"
                                        inputMode="decimal"
                                    />
                                    <CustomInput
                                        control={control}
                                        name={"age"}
                                        deleteItem={deleteItem}
                                        placeholder="age"
                                    />
                                    <Box sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        height: "auto",
                                        justifyContent: "space-between",
                                    }}>
                                        <BasicMenu items={activities} value={selectActivity} setValue={setSelectActivity} />
                                        <Box sx={{
                                            position: "relative",
                                            display: "flex",
                                            height: "100%",
                                            width: "50%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Typography variant={'body1'} sx={{
                                                color: "white",
                                                fontWeight: 500,
                                                textAlign: "center",
                                            }}>
                                                {selectActivity}
                                            </Typography>
                                        </Box>
                                    </Box>
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
                                            variant="outlined"
                                            disabled={hasInvalidFields}
                                            sx={{
                                                height: "2.5rem",
                                                maxWidth: "80%",
                                                borderRadius: 2,
                                                // Stile normale
                                                border: "1px solid #7f22fe",
                                                boxShadow: "0 0 30px rgba(138, 43, 226, 0.4)",
                                                color: "#b385f7",
                                                // Stile quando è disabilitato (opzionale, per evitare che MUI lo faccia grigio)
                                                "&.Mui-disabled": {
                                                    border: "1px solid #7f22fe",
                                                    opacity: 0.5,
                                                    color: "#b385f7",
                                                    boxShadow: "none",
                                                }
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
                                        {(bmr !== "0" || !bmr || !hasInvalidFields) && <IconButton
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
                                        backgroundColor: `${gender === "M" ? blue[900] : "#7a25f9"}`
                                    }}
                                    variant="contained"
                                    onClick={handleGender}>
                                    Scegli il genere {gender}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
                <div>
                    <Snackbar
                        open={openSnack}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnack(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <Alert
                            onClose={() => setOpenSnack(false)}
                            severity={severityAlert ? "success" : "error"}
                            variant="filled"
                            sx={{ width: "100%" }}
                        >
                            {msgCalcBmr}
                        </Alert>
                    </Snackbar>

                </div>
            </div>
        </LazyGlobalWrapper>
    )
};