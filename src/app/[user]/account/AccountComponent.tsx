'use client'

import Link from "next/link";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import dynamic from "next/dynamic";
import { useGet, useGetParsedZod } from "@/src/tanstack/api/useGet";
import { userBmrDbType } from "@/src/zod/userBmrSchema";
import { usePathname } from "next/navigation";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useCustomDeleteMutation } from "@/src/tanstack/api/useDelete";
import { StatisticUserSchema } from "@/src/zod/StatisticUser";


const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: true
});

const formatDate = (date: string) => {
    if (!date) return "";
    const splitDate = date.split("T");
    const newDate = splitDate[0];
    const newSplit = newDate.split("-");
    const y = newSplit[0];
    const mo = newSplit[1];
    const d = newSplit[2];

    const splitTime = splitDate[1].split(":");
    const h = splitTime[0];
    const m = splitTime[1];

    return `${d}/${mo}/${y} - ${h}:${m}`
}

export default function AccountComponent() {
    const pathname = usePathname();
    const rawSlug = pathname.split("/")[1];
    const slug = decodeURIComponent(rawSlug); // <-- FIX
    const goBack = `/${slug}/dashboard`;

    const { data: bmrData, isLoading: loadingBmr } = useGet<userBmrDbType[]>({
        key: ["get-data-bmr-user"],
        url: "/api/save-bmr",
        enabled: true,
        staleTime: 0,
        retry: 1,
        gcTime: 60 * 60 * 20,
    });

    const deleteRecord = useCustomDeleteMutation<number, userBmrDbType[]>({
        mutationKey: ["delete-selected-record"],
    });

    const handleDeleteRecord = async (order: number) => {
        try {
            const res = await deleteRecord.mutateAsync({
                url: "/api/save-bmr",
                body: order,
                invalidateKeys: ["get-data-bmr-user", "get-statistic-for-user"]
            });

            if (res.status === 500) return;
            console.log("Record eliminato numero", order);
        } catch (error: Error | unknown) {
            console.log("Errore nella chiamata API: ", error instanceof Error ? error.message : error);
        }
    }

    const apiUrlPy = process.env.URL_API_PY ?? "http://127.0.0.1:8002";

    // 1. Estrazione sicura con optional chaining
    const emailUser = bmrData?.data?.[0]?.user_name !== undefined ? bmrData?.data?.[0]?.user_name : "";

    const statisticUserParsed = useGetParsedZod({
        // 2. AGGIUNGI emailUser ALLA KEY: quando emailUser cambia da "" a "mario@email.it", 
        // TanStack Query sa che deve fare la fetch!
        key: ["get-statistic-for-user", emailUser],
        url: `${apiUrlPy}/api/statistic-for-user`,
        body: { email: bmrData?.data?.[0]?.user_name },

        // 3. ENABLED Semplificato: la query parte SOLO se emailUser NON è vuota!
        enabled: Boolean(emailUser && emailUser.trim().length > 0) && emailUser !== "" && emailUser !== undefined,

        staleTime: 0,
        retry: 2,
        gcTime: 60 * 60 * 20,
        schema: StatisticUserSchema
    });
    console.log("RAW PYTHON RESPONSE:", statisticUserParsed.data);

    console.log("La mail dell'utente è presente? ", emailUser ?? "No");
    console.log("Chissà se i dati Python sono stati chiamati: ", statisticUserParsed.data?.data); // output positivo

    const roundedValue = (val: string): string => {
        const replacedVal = val.replace(".", ",");
        return Math.round(parseFloat(replacedVal)).toString();
    };

    const floatingValue = (value: string): string => {
        const replacedValue = parseFloat(value);
        return replacedValue.toFixed(2).replace(".", ",");
    };

    return (
        <LazyGlobalWrapper>
            <div className="dashboard">
                <div className="relative flex flex-row h-auto w-full">
                    <Link href={`${goBack}`} className="links links-hover">Back</Link>
                </div>
                <div className="relative flex flex-row h-full w-full justify-evenly items-center">
                    <div className="cards gradient-border">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>
                                    I tuoi risultati
                                </p>
                            </div>
                            <div className="body_cards2">
                                <div className="relative flex flex-col max-h-82 overflow-y-auto gap-2">
                                    {bmrData?.data !== undefined ?
                                        (
                                            bmrData?.data.map((el) => {
                                                const newDate = formatDate(el.created_at);

                                                return (
                                                    <div
                                                        key={el.id} // meglio un id univoco che l’indice
                                                        className="border-b border-base-300 pb-2 last:border-none"
                                                    >
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>Altezza:</p>
                                                            <p>{el.height} cm</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>Peso:</p>
                                                            <p>{el.weight} kg</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>Età:</p>
                                                            <p>{el.age}</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>Stile di vita:</p>
                                                            <p>{el.activity}</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>Sesso:</p>
                                                            <p>{el.gender}</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>BMR:</p>
                                                            <p>{el.bmr}</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <p>In data:</p>
                                                            <p>{newDate}</p>
                                                        </div>
                                                        <div className="flex flex-row justify-between w-full h-10">
                                                            <IconButton onClick={() => handleDeleteRecord(el.order)}>
                                                                <CloseIcon color="error" fontSize="large" />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <>
                                                <p>Nessun dato salvato</p>
                                            </>
                                        )}
                                    {
                                        loadingBmr ? (
                                            <Typography component={'span'}>
                                                <CircularProgress />
                                                Dati in caricamento...
                                            </Typography>
                                        ) : (
                                            <p>Nessun dato trovato</p>
                                        )
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="cards gradient-border">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>Dati statistici di {statisticUserParsed.data?.data.name || " - "}</p>
                            </div>
                            <div className="body_cards2">
                                <div className="body_cards2">
                                    {
                                        statisticUserParsed.isLoading ? (
                                            <Typography component={'span'}>
                                                <CircularProgress />
                                                Dati in caricamento...
                                            </Typography>
                                        ) : (
                                            <>
                                                {
                                                    statisticUserParsed.error ? (
                                                        <p>Errore nel caricamento dati: {statisticUserParsed.error instanceof Error ? statisticUserParsed.error.message : ""}</p>
                                                    ) : (
                                                        <>
                                                            {
                                                                !statisticUserParsed.data ? (
                                                                    <p>Dati ancora non caricati: {statisticUserParsed.error}</p>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            !statisticUserParsed.data.data ? (
                                                                                <p>Nessun dato {statisticUserParsed.data.message}</p>
                                                                            ) : (
                                                                                <div className="relative flex flex-col max-h-82 overflow-y-auto gap-8">
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Email utente:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{statisticUserParsed.data.data.email}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Attività media:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{statisticUserParsed.data.data.average_activity}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Bmr medio:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{floatingValue(statisticUserParsed.data.data.average_bmr)}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Peso medio:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{roundedValue(statisticUserParsed.data.data.average_weight)}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Altezza media:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{roundedValue(statisticUserParsed.data.data.average_height)}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>Età media:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>{roundedValue(statisticUserParsed.data.data.average_age)}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>lista Peso:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_weight.map((i, idx) => (
                                                                                                        <span key={idx}>{`${floatingValue(i)} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>lista Altezza:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_height.map((i, idx) => (
                                                                                                        <span key={idx}>{`${floatingValue(i)} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>lista Età:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_age.map((i, idx) => (
                                                                                                        <span key={idx}>{`${floatingValue(i)} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>lista BMR:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_bmr.map((i, idx) => (
                                                                                                        <span key={idx}>{`${floatingValue(i)} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>lista Attività:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_activity.map((i, idx) => (
                                                                                                        <span key={idx}>{`${i} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 grid-rows-1 justify-between w-full h-auto">
                                                                                        <div className="grid col-1 row-1 w-full"><p>N. dati salvati:</p></div>
                                                                                        <div className="grid col-2 row-1 h-auto w-full justify-end">
                                                                                            <p>
                                                                                                {
                                                                                                    statisticUserParsed.data.data.list_order.map((i, idx) => (
                                                                                                        <span key={idx}>{`${i} | `}</span>
                                                                                                    ))
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LazyGlobalWrapper>
    )
}