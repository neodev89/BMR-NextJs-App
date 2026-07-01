'use client'

import dynamic from "next/dynamic";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { useGet } from "@/src/tanstack/api/useGet";
import { userBmrDbType } from "@/src/zod/userBmrSchema";
import { usePathname } from "next/navigation";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useCustomDeleteMutation } from "@/src/tanstack/api/useDelete";

const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});

const formatDate = (date: string) => {
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

    const userBmr = useGet<userBmrDbType[]>({
        key: ["get-data-bmr-user"],
        url: "/api/save-bmr",
        enabled: true,
        staleTime: 60 * 10,
        retry: 3,
        gcTime: 60 * 60 * 20,
    });
    const risultati = userBmr.data ? userBmr.data.data : [];
    console.log("i dati del'utente sono: ", userBmr.data?.data ?? []);

    const deleteRecord = useCustomDeleteMutation<number, userBmrDbType[]>({
        mutationKey: ["delete-selected-record"],
    });

    const handleDeleteRecord = async (id: number) => {
        try {
            const res = await deleteRecord.mutateAsync({
                url: "/api/save-bmr",
                body: id,
                invalidateKeys: ["get-data-bmr-user"]
            });
            if (res.status === 500) return;
            console.log("Record eliminato");
        } catch (error: Error | unknown) {
            console.log("Errore nella chiamata API: ", error instanceof Error ? error.message : error);
        }
    }

    return (
        <LazyGlobalWrapper>
            <div className="dashboard">
                <div className="relative flex flex-row h-auto w-full">
                    <Link href={`${goBack}`} className="links links-hover">Back</Link>
                </div>
                <div className="cards gradient-border">
                    <div className="subcards">
                        <div className="title_cards">
                            <p>
                                I tuoi risultati
                            </p>
                        </div>
                        <div className="body_cards2">
                            <div className="relative flex flex-col max-h-82 overflow-y-auto gap-2">
                                {risultati.length > 0 ? (
                                    risultati.map((el) => {
                                        const newDate = formatDate(el.createdAt);

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
                                                    <p>In data:</p>
                                                    <p>{newDate}</p>
                                                </div>
                                                <div className="flex flex-row justify-between w-full h-10">
                                                    <IconButton onClick={() => handleDeleteRecord(el.id)}>
                                                        <CloseIcon color="error" fontSize="large" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <>
                                        {
                                            userBmr.isLoading ? (
                                                <Typography component={'span'}>
                                                    <CircularProgress />
                                                    Dati in caricamento...
                                                </Typography>
                                            ) : (
                                                <p>Nessun dato trovato</p>
                                            )
                                        }
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </LazyGlobalWrapper>
    )
}