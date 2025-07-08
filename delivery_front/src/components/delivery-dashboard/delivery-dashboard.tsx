import type { FC } from "react";
import { DeliveryDashboardUI } from "../ui/delivery-dashboard";
import type { DeliveryDashboardProps } from "./type";

export const DeliveryDashboard:FC<DeliveryDashboardProps> = ({deliveryData}) => {      
    return <DeliveryDashboardUI deliveryData={deliveryData}/>
}