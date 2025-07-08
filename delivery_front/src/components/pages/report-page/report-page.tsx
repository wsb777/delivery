import { useEffect, useMemo, useState, type FC } from "react";
import { ReportPageUI } from "../../ui/report-page";
import dayjs, { Dayjs } from "dayjs";
import type { TDelivery } from "../../../utils/types";
import { CircularProgress, type SelectChangeEvent } from "@mui/material";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { findEdgeDates } from "../../../utils/edge-dates";
import { getOrdersApi } from "../../../utils/delivery-api";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


export const ReportPage: FC = () => {
    const [deliveries, setDeliveries] = useState<TDelivery[]>([])
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных и получение крайних дат
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const { orders } = await getOrdersApi();
                setDeliveries(orders);

                if (orders.length > 0) {
                    const edgeDates = findEdgeDates(orders);
                    setStartDate(dayjs(edgeDates.minDate, 'YYYY-MM-DD'));
                    setEndDate(dayjs(edgeDates.maxDate, 'YYYY-MM-DD'));
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);
    // Состояния для фильтров
    const [filterValues, setFilterValues] = useState({
        delivery: "Все",
        packing: "Все"
    });
    const title = "Отчет по доставкам";
    // Динамическое формирование периода
    const period = useMemo(() => {
        if (!startDate || !endDate) return "Загрузка дат...";
        return `${startDate.format('DD.MM.YYYY')} — ${endDate.format('DD.MM.YYYY')}`;
    }, [startDate, endDate]);

    const deliveryCounts = [
        "янв. 2", "янв. 4", "янв. 6", "янв. 7",
        "янв. 8", "янв. 9", "янв. 10", "янв. 11"
    ];

    // Уникальные типы для селектов
    const packingTypes = ['Все', ...new Set(deliveries.map(d => d.packagingType))];
    const deliveryTypes = ['Все', ...new Set(deliveries.map(d => d.service))];

    // Обработчик изменения фильтров
    const handleChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };

    // Фильтрация данных
    const filteredDeliveries = useMemo(() => {
        // Если даты не установлены, возвращаем все заказы
        if (!startDate || !endDate) return deliveries;

        return deliveries.filter(delivery => {
            try {
                // Фильтр по дате
                const deliveryDate = dayjs(delivery.orderDate, 'YYYY-MM-DD');
                const datePass = deliveryDate.isSameOrAfter(startDate, 'day') &&
                    deliveryDate.isSameOrBefore(endDate, 'day');

                // Фильтр по упаковке
                const packingPass = filterValues.packing === 'Все' ||
                    delivery.packagingType === filterValues.packing;

                // Фильтр по типу доставки
                const deliveryPass = filterValues.delivery === 'Все' ||
                    delivery.service === filterValues.delivery;

                return datePass && packingPass && deliveryPass;
            } catch (e) {
                console.error("Ошибка фильтрации заказа:", delivery, e);
                return false;
            }
        });
    }, [startDate, endDate, filterValues, deliveries]);

    const deliveryData = useMemo(() => {
        // Если нет отфильтрованных доставок, возвращаем пустой массив
        if (filteredDeliveries.length === 0) return [];

        // Создаем объект для группировки по дням
        const deliveriesByDay: Record<string, number> = {};

        // Группируем доставки по дням
        filteredDeliveries.forEach(delivery => {
            // Преобразуем дату в формат "День.Месяц" (например, "01.01")
            const dayKey = dayjs(delivery.orderDate, 'YYYY-MM-DD').format('DD.MM.YYYY');

            // Инициализируем счетчик для дня, если его еще нет
            if (!deliveriesByDay[dayKey]) {
                deliveriesByDay[dayKey] = 0;
            }

            // Увеличиваем счетчик для этого дня
            deliveriesByDay[dayKey]++;
        });

        // Преобразуем объект в массив для графика
        return Object.entries(deliveriesByDay).map(([date, deliveries_count]) => ({
            date,
            deliveries_count
        }));
    }, [filteredDeliveries]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!deliveries.length) {
        return <div>Нет данных о доставках</div>;
    }

    return <ReportPageUI
        handleChange={handleChange}
        packingTypes={packingTypes}
        deliveryTypes={deliveryTypes}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        title={title}
        period={period}
        deliveryCounts={deliveryCounts}
        deliveries={filteredDeliveries}
        filterValues={filterValues}
        deliveryData={deliveryData}
    />
}