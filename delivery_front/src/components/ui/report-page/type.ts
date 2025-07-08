import type { SetStateAction } from "react";
import type { TDelivery } from "../../../utils/types";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import type { Dayjs } from "dayjs";
import type { SelectChangeEvent } from "@mui/material";

export type ReportPageUIProps = {
    title: string;
    period: string;
    deliveryCounts: string[];
    deliveries: TDelivery[];
    startDate:PickerValue | undefined ;
    endDate: PickerValue | undefined ;
    setStartDate: (e: SetStateAction<Dayjs | null>) => void;
    setEndDate: (e: SetStateAction<Dayjs | null> ) => void;
    packingTypes: string[];
    deliveryTypes: string[];
    handleChange: (e:SelectChangeEvent) => void;
    filterValues: {delivery:string, packing:string}
    deliveryData: {date: string, deliveries_count: number}[]
}