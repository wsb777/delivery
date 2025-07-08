
import type { TDelivery } from "./types";

export function findEdgeDates(deliveries: TDelivery[]) {
    let minDate = deliveries[0].orderDate;
    let maxDate = deliveries[0].orderDate;

    for (const delivery of deliveries) {
        const [day, month, year] = delivery.orderDate.split('-').map(Number);
        const currentDateNum = year * 10000 + month * 100 + day;
        
        const [minDay, minMonth, minYear] = minDate.split('-').map(Number);
        const minDateNum = minYear * 10000 + minMonth * 100 + minDay;
        
        const [maxDay, maxMonth, maxYear] = maxDate.split('-').map(Number);
        const maxDateNum = maxYear * 10000 + maxMonth * 100 + maxDay;

        if (currentDateNum < minDateNum) minDate = delivery.orderDate;
        if (currentDateNum > maxDateNum) maxDate = delivery.orderDate;
    }
    return { minDate, maxDate };
}