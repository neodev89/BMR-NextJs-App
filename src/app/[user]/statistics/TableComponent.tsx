"use client"

import dynamic from "next/dynamic";
import { tokenApiResponse } from "@/src/@types/ApiResponse";
import { useGet, useGetParsedZod } from "@/src/tanstack/api/useGet";
import { ColumnStatisticTypes, StatisticUserSchema } from "@/src/zod/StatisticUser";
import { useEffect, useState } from "react";
import { downloadUserCsv } from "./callCSV";
import { CircularProgress } from "@mui/material";


const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false
});


function formattaIsoConSplit(isoString: string, separator = '/') {
    if (!isoString || typeof isoString !== 'string') return "";

    // 1. Isola la parte della data separandola dall'orario con la 'T'
    const dataParte = isoString.split('T')[0]; // Risultato: "2026-10-27"

    // 2. Divide ulteriormente la data in anno, mese e giorno usando il trattino '-'
    const [year, month, day] = dataParte.split('-');

    // 3. Ricostruisce la stringa nel formato italiano desiderato
    return `${day}${separator}${month}${separator}${year}`;
}

export default function TableComponent() {
    const apiUrlPy = process.env.URL_API_PY ?? "http://127.0.0.1:8002";

    const { data: tokenData, isLoading: loadTk } = useGet<tokenApiResponse>({
        key: ["get-cookies"],
        url: "cookies"
    });
    console.log(tokenData);

    const { data: statistic_user_data, isLoading: statLoading, isSuccess } = useGetParsedZod({
        key: ["get-statistic-for-user"],
        url: `${apiUrlPy}/api/statistic-for-user`,
        body: { email: tokenData?.data?.email },
        enabled: loadTk ? false : true,
        staleTime: 1000 * 60 * 2,
        retry: 3,
        gcTime: 1000 * 60 * 5,
        schema: StatisticUserSchema,
    });
    const statisticUserData = statistic_user_data?.data;
    console.log("Statistiche presenti? → ", statistic_user_data?.data ?? "NO!");

    const nameColHead = [
        "Nome", "Email", "Peso", "Altezza", "Età", "Attività", "BMR",
        "Media Peso", "Media Altezza", "Media Età", "Media attività", "Media BMR", "Data Snapshot", "Totale salvataggi",
    ]

    const [rowsStat, setRowsStat] = useState<ColumnStatisticTypes | null>(null);
    const [loadRows, setLoadRows] = useState<boolean>(false);

    useEffect(() => {
        async function setDataStatistic() {
            try {
                setLoadRows(true);
                if (!isSuccess) return;
                if (statLoading) return;
                if (!statisticUserData) return;
                const newStatistic: ColumnStatisticTypes = {
                    email: statisticUserData.email,
                    name: statisticUserData.name,
                    list_weight: statisticUserData.list_weight,
                    list_height: statisticUserData.list_height,
                    list_age: statisticUserData.list_age,
                    list_activity: statisticUserData.list_activity,
                    list_bmr: statisticUserData.list_bmr,
                    average_weight: statisticUserData.average_weight,
                    average_height: statisticUserData.average_height,
                    average_age: statisticUserData.average_age,
                    average_activity: statisticUserData.average_activity,
                    average_bmr: statisticUserData.average_bmr,
                    creations_date: statisticUserData.creations_date,
                    list_order: statisticUserData.list_order,
                };
                setRowsStat(newStatistic);
            } catch (e: unknown) {
                setLoadRows(true);
                console.log("Errore chiamata ", String(e));
            } finally {
                setLoadRows(false);
            }
        };
        setDataStatistic();
    }, [loadTk, statLoading, statisticUserData, isSuccess]);

    // Funzione asincrona da passare al bottone
    const handleExportClick = async () => {
        const userEmail = tokenData?.data.email;
        if (!userEmail) return;
        await downloadUserCsv(userEmail);
    };

    return (
        <LazyGlobalWrapper>
            <div className="relative flex flex-row h-120 w-full p-2 border overflow-hidden">
                <div className="relative flex flex-col h-full w-max overflow-auto">
                    <div className="relative flex flex-row h-1/4 w-full justify-start items-center">
                        <button type="button" onClick={handleExportClick} className="h-12 w-32 cursor-pointer rounded-2xl border border-gray-100 text-white p-2">Importa CSV</button>
                    </div>
                    <div className="relative flex flex-row h-3/4 w-full">
                        <table className="border-gray-300 border-collapse w-full">
                            <thead>
                                <tr>
                                    {
                                        nameColHead.length > 0 ? (
                                            nameColHead.map((el, idx) => (
                                                <th className="min-w-50 h-16 text-center px-2 border border-gray-100" key={idx}>
                                                    {el}
                                                </th>
                                            ))
                                        ) : (
                                            <th>Nessun dato</th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loadRows ? (
                                        <div className="h-20 w-full flex p-5">
                                            <CircularProgress size={'7rem'} sx={{
                                                color: '#7f22fe'
                                            }} />
                                        </div>
                                    ) : (
                                        <tr className="text-center">
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.email : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.name : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.list_weight.map(el => {
                                                    const replaced = String(el).replace(".", ",");
                                                    return `${replaced} | `;
                                                }) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.list_height.map(el => {
                                                    const replaced = String(el).replace(".", ",");
                                                    return `${replaced} | `;
                                                }) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.list_age.map(el => `${el} | `) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.list_activity.map(el => `${el} | `) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.list_bmr.map(el => {
                                                    const replaced = String(el).replace(".", ",");
                                                    return `${replaced} | `;
                                                }) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? String(rowsStat.average_weight).replace(".", ",") : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.average_height : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.average_age : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.average_activity : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? rowsStat.average_bmr : ''}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? formattaIsoConSplit(rowsStat.creations_date) : '-'}
                                            </td>
                                            <td className="border border-gray-100">
                                                {rowsStat ? (rowsStat.list_order.length === 1 ? 1 : rowsStat.list_order.reduce((a, b) => a + b)) : '0'}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </LazyGlobalWrapper >
    )
}