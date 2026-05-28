'use client'

import "@/src/app/globals.css";
import CustomInput from "@/src/ui/components/CustomInput";
import dynamic from "next/dynamic";

import { Path, useForm, useWatch } from "react-hook-form";
import { loginSchema, loginSchemaType } from "@/src/zod/controlLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { selectRegisteredAppType } from "@/src/db/schema/registered";
import { useTotalCustomMutation } from "@/src/tanstack/api/useTotalMutation";

const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});


export default function LoginComponent() {
    const { control, reset, setValue, handleSubmit } = useForm<loginSchemaType>({
        defaultValues: {
            userName: "",
            password: "",
            name: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const userName = useWatch({
        control,
        name: "userName",
    });
    const router = useRouter();
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [apiMxg, setApiMxg] = useState<string>("");

    const login = useTotalCustomMutation<loginSchemaType, { user: selectRegisteredAppType, tkn: string } | null | undefined>({
        mutationKey: ["login-key-mutation"],
    });
    const rigeneraToken = useTotalCustomMutation<string, string>({
        mutationKey: ["rigenera-token-login"],
    });

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
                method: "POST",
                body: data,
            });

            if (result.status === 200 && result.res.data) {
                console.log("Ci sono sia i dati che il name", result.res);
                router.push(`/${result.res.data?.user.name}/dashboard`);
            }
            if (result.status === 401 || result.status === 404) {
                console.log(result.res.message);
                setApiMxg(result.res.message);
                setIsAlert(true);
                router.push("/login");
            }
            if (result.status === 400) {
                setIsAlert(false);
                setApiMxg(result.res.message);
                setIsRegister(true);
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
            if (result.status === 401) {
                setIsAlert(true);
                setApiMxg(result.res.message);
            }

            setApiMxg(result.res.message);
        } catch (error: Error | unknown) {
            const mxg = error instanceof Error ? error.message : error;
            console.log("Errore nella chiamata API ", mxg);
        }
    }

    const handleToken = async () => {
        try {
            const result = await rigeneraToken.mutateAsync({
                url: "/api/cookies",
                method: "PUT",
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

    // vecchio token ponzio: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBvbnppb0BwaWxhdG8uaXQiLCJpYXQiOjE3NzkyMDU4MjAsImV4cCI6MTc3OTI5MjIyMH0.cmc634zpgIVwzfj02KvBnKzieVjgu3oQmHGqX4wnl00

    return (
        <LazyGlobalWrapper>
            {
                (login.isPending) ? (
                    <div className="relative flex flex-row w-full justify-center items-center">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <>
                        {
                            login.isError ? (
                                <Typography variant="h3" color="error">
                                    {login.error.message}
                                </Typography>
                            ) : (
                                <div className="container_form">
                                    <form className="form">
                                        <div className="inner_form">
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
                                                <div className="relative flex flex-row justify-between items-center min-h-20 h-auto gap-2 flex-wrap w-full">
                                                    <Button
                                                        type="button"
                                                        onClick={handleResetFieldAndBack}
                                                        sx={{ height: "3.5rem", width: "11rem", border: "1px solid #7f22fe", color: "7f22fe" }}
                                                    >
                                                        Cancella campi
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="outlined"
                                                        onClick={handleSubmit(handleSubmitRegister)}
                                                        sx={{
                                                            height: "3.5rem", width: "10rem",
                                                            color: "#7f22fe"
                                                        }}
                                                    >
                                                        Registrati
                                                    </Button>
                                                    <Alert severity="error">{apiMxg}</Alert>
                                                </div>
                                            ) : (
                                                <>
                                                    <Button
                                                        type="button"
                                                        onClick={handleResetField}
                                                        sx={{ height: "3.5rem", width: "11rem", border: "1px solid #7f22fe", color: "#7f22fe" }}
                                                    >
                                                        Cancella campi
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        onClick={handleSubmit(handleSubmitForm)}
                                                        sx={{ height: "3.5rem", width: "8rem", backgroundColor: "#7f22fe", color: "white" }}
                                                    >
                                                        Invia
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                    </>
                )
            }
        </LazyGlobalWrapper>
    )
}