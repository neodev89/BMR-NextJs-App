import { RowsStatisticTypes } from "../zod/StatisticUser";

export interface modalChangeValTabTypes {
    row: RowsStatisticTypes;
    open: boolean;
    setOpen: (open: boolean) => void;
    handleClose: () => void;
    handleChangeVal: (value: Partial<RowsStatisticTypes>) => RowsStatisticTypes;
}