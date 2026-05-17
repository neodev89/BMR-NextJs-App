'use client'

import "@/src/app/globals.css";
import CustomInput from "@/src/ui/components/CustomInput";
import dynamic from "next/dynamic";

import { Path, useForm, useWatch } from "react-hook-form";
import { loginSchema, loginSchemaType } from "@/src/zod/controlLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button } from "@mui/material";
import { useCustomMutation } from "@/src/tanstack/api/usePost";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { selectRegisteredAppType } from "@/src/db/schema/registered";
import { useCustomPutMutation } from "@/src/tanstack/api/usePut";

const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});


export default function LoginComponent() {
    const { control, getValues, reset, setValue, handleSubmit } = useForm<loginSchemaType>({
        defaultValues: {
            userName: "",
            password: "",
            name: "",
        },
        resolver: zodResolver(loginSchema),
    });
    const router = useRouter();
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [apiMxg, setApiMxg] = useState<string>("");

    const login = useCustomMutation<loginSchemaType, selectRegisteredAppType>(["login-key-mutation"]);
    const rigeneraToken = useCustomPutMutation<string, string>(["rigenera-token-login"]);
    
    const handleResetField = useCallback(() => {
        reset({
            userName: "",
            password: "",
            name: "",
        });
    }, [reset]);

    const handleResetFieldAndBack = useCallback(() => {
        reset({
            userName: "",
            password: "",
            name: "",
        });
        setIsRegister(false);
    }, [reset]);

    const name = useWatch({
        control,
        name: "name",
    });


    const deleteItem = (name: Path<loginSchemaType>) => {
        setValue(name, "");
    };

    const handleSubmitForm = async (data: loginSchemaType) => {
        try {
            const result = await login.mutateAsync({
                url: "/api/login",
                body: data,
            });

            if (result.status === 400) {
                setIsRegister(true);
                setApiMxg(result.res.message);
            }
            if (result.status === 404) {
                setIsRegister(true);
                setApiMxg(result.res.message);
            }
            if (result.status === 200) {
                console.log("Ci sono sia i dati che il name", result.res);
                router.push(`/${result.res.data.name}/dashboard`);
            }
            if (result.status === 401) {
                console.log(result.res.message);
                setApiMxg(result.res.message);
                setIsAlert(true);
            }

            // if (result.res) {
            //     console.log("Il result della API è: ", result.res);
            //     // output: {success: true, message: 'Il login è stato effettuato', data: {…}, status: 200}
            // } else {
            //     console.log(result);
            // }
        } catch (error: unknown) {
            const mxg = error instanceof Error ? error.message : error;
            console.log("Errore nella chiamata API ", mxg);
        }
    }

    const handleSubmitRegister = async (data: loginSchemaType) => {
        try {
            const result = await login.mutateAsync({
                url: "/api/register",
                body: data,
            });

            if (result.res.status === 200 && name !== "") {
                router.push(`/${name}/dashboard`);
                setIsRegister(false);
            }
        } catch (error: Error | unknown) {
            const mxg = error instanceof Error ? error.message : error;
            console.log("Errore nella chiamata API ", mxg);
        }
    }

    const handleToken = async () => {
        try {
            const userName = getValues("userName");
            const result = await rigeneraToken.mutateAsync({
                url: "/api/cookies",
                body: userName,
            });

            if (result.status === 404 || result.status === 500) return;
            router.push(`${name}/dashboard`);
        } catch (error) {
            console.log("Errore nella PUT: ", error);
            return;
        }
    }

    useEffect(() => {
        console.log(name);
    }, [name]);

    return (
        <LazyGlobalWrapper>
            <div className="container_form">
                <form className="relative flex flex-col h-full w-1/3 justify-center border border-green-300 rounded-2xl p-4">
                    <div className="relative flex flex-col w-full h-auto gap-3 py-2 px-1">
                        {/** Qui andrà il modulo */}
                        <CustomInput
                            control={control}
                            name="userName"
                            deleteItem={deleteItem}
                            label="email"
                            type="email"
                            placeholder="email"
                        />
                        <CustomInput
                            control={control}
                            name="password"
                            deleteItem={deleteItem}
                            label="password"
                            type="password"
                            placeholder="password"
                        />
                        <CustomInput
                            control={control}
                            name="name"
                            deleteItem={deleteItem}
                            label="name"
                            type="text"
                            placeholder="name"
                        />
                        {
                            isAlert &&
                            (
                                <>
                                    <Alert severity="error">{apiMxg}</Alert>
                                    <Button
                                        type="button"
                                        color="error"
                                        variant="contained"
                                        sx={{
                                            height: "2.5rem",
                                            maxWidth: "80%",
                                        }}
                                        onClick={handleToken}
                                    >
                                        Rigenera token
                                    </Button>
                                </>
                            )
                        }
                    </div>
                    <div className="relative flex flex-row justify-between h-24 w-full">
                        {/** qui il submit */}
                        {isRegister ? (
                            <>
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={handleResetFieldAndBack}
                                    sx={{ height: "3.5rem", width: "11rem", border: "1px solid #1976d2" }}
                                >
                                    Cancella campi
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="outlined"
                                    onClick={handleSubmit(handleSubmitRegister)}
                                    sx={{
                                        height: "3.5rem", width: "10rem",
                                    }}
                                >
                                    Registrati
                                </Button>
                                <Alert severity="error">{apiMxg}</Alert>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={handleResetField}
                                    sx={{ height: "3.5rem", width: "11rem", border: "1px solid #1976d2" }}
                                >
                                    Cancella campi
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    onClick={handleSubmit(handleSubmitForm)}
                                    sx={{ height: "3.5rem", width: "8rem" }}
                                >
                                    Invia
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </LazyGlobalWrapper>
    )
}