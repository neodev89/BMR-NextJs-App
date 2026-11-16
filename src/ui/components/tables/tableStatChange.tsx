'use client'

import { CircularProgress } from "@mui/material";
import { tableStatChangeTypes } from "@/src/@types/tables/tableStatTypes";
import { ControlledInput } from "../custom-input/customControlledInput";
import { RowsStatisticTypes } from "@/src/zod/StatisticUser";


export default function TableStat({
    control,
    name,
    nameColHead,
    rowsStat,
    loadRows,
    formattaIsoConSplit,
    onChangesVal,
    onSaveData
}: tableStatChangeTypes) {
    const initialState: RowsStatisticTypes = {
        email: "",
        name: "",
        list_weight: [],
        list_height: [],
        list_age: [],
        list_activity: [],
        list_bmr: [],
        average_weight: 0,
        average_height: 0,
        average_age: 0,
        average_activity: "",
        average_bmr: 0,
        creations_date: "",
        list_order: []
    }

    // list_weight is an array of primitive values, not field-array objects.
    const weightRows = rowsStat?.list_weight ?? initialState.list_weight;

    return (
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
                        weightRows.length === 0 ? (
                            <tr>
                                <td className="border border-gray-100">
                                    Nessun dato disponibile
                                </td>
                            </tr>
                        ) : (
                            weightRows.map((_, index) => (
                                <tr key={index} className="text-center">
                                    {/* Email (Campo singolo) */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="email"
                                            type="email"
                                            values={rowsStat ? rowsStat.email : '-'}
                                        />
                                    </td>

                                    {/* Name (Campo singolo) */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="name"
                                            type="text"
                                            values={rowsStat ? rowsStat.name : '-'}
                                        />
                                    </td>

                                    {/* Storico Peso (Modificabile via input) */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name={`list_weight.${index}`}
                                            type="text"
                                            values="" // Gestito automaticamente dal form state
                                        />
                                    </td>

                                    {/* Storico Altezza (Modificabile via input) */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name={`list_height.${index}`}
                                            type="text"
                                            values=""
                                        />
                                    </td>

                                    {/* Storico Età */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name={`list_age.${index}`}
                                            type="number"
                                            values=""
                                        />
                                    </td>

                                    {/* Storico Attività */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name={`list_activity.${index}`}
                                            type="text"
                                            values=""
                                        />
                                    </td>

                                    {/* Storico BMR */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name={`list_bmr.${index}`}
                                            type="text"
                                            values=""
                                        />
                                    </td>

                                    {/* Campi medi e finali (Average e Data) rimangono invariati */}
                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="average_weight"
                                            type="text"
                                            values={rowsStat ? String(rowsStat.average_weight).replace(".", ",") : '-'}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="average_height"
                                            type="text"
                                            values={rowsStat ? rowsStat.average_height : '-'}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="average_age"
                                            type="number"
                                            values={rowsStat ? rowsStat.average_age : '-'}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="average_activity"
                                            type="text"
                                            values={rowsStat ? rowsStat.average_activity : '-'}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="average_bmr"
                                            type="text"
                                            values={rowsStat ? rowsStat.average_bmr : ''}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        <ControlledInput
                                            control={control}
                                            name="creations_date"
                                            type="text"
                                            values={rowsStat ? formattaIsoConSplit(rowsStat.creations_date) : '-'}
                                        />
                                    </td>

                                    <td className="border border-gray-100">
                                        {rowsStat ? (rowsStat.list_order.length === 1 ? 1 : rowsStat.list_order.reduce((a, b) => a + b)) : '0'}
                                    </td>
                                </tr>
                            ))
                        )
                    )
                }
            </tbody>
        </table>
    )
}