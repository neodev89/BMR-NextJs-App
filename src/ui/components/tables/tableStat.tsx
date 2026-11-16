'use client'

import { CircularProgress } from "@mui/material";
import { tableStatTypes } from "@/src/@types/tables/tableStatTypes";


export default function TableStat({
    nameColHead,
    rowsStat,
    loadRows,
    formattaIsoConSplit
}: tableStatTypes) {
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
    )
}