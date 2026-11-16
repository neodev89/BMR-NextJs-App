import { RowsStatisticTypes, StatisticUserTypes } from "@/src/zod/StatisticUser";
import { Control, Path } from "react-hook-form";

interface tableStatTypes {
    nameColHead: string[];
    loadRows: boolean;
    rowsStat: RowsStatisticTypes | null;
    formattaIsoConSplit: (isoString: string, separator?: string) => string
}

interface tableStatChangeTypes {
    control: Control<RowsStatisticTypes>;
    name: Path<RowsStatisticTypes>;
    nameColHead: string[];
    loadRows: boolean;
    rowsStat: RowsStatisticTypes | null;
    formattaIsoConSplit: (isoString: string, separator?: string) => string
    onChangesVal: (data: Partial<RowsStatisticTypes>) => Partial<RowsStatisticTypes>;
    onSaveData: (data: RowsStatisticTypes) => StatisticUserTypes;
}

export type {
    tableStatTypes, tableStatChangeTypes
}


