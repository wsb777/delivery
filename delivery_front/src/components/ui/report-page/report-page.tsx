import { type FC } from 'react';
import {
    Box,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import type { ReportPageUIProps } from './type';
import { DeliveryDashboard } from '../../delivery-dashboard';

// Типы данных

export const ReportPageUI: FC<ReportPageUIProps> = ({
    title,
    deliveries,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    packingTypes,
    deliveryTypes,
    handleChange,
    filterValues,
    deliveryData
}) => {
    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
            {/* Заголовок отчета */}
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>

            {/* Период и фильтры */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker format="DD.MM.YYYY" onChange={(value) => setStartDate(value)} value={startDate} />
                        <DatePicker format="DD.MM.YYYY" onChange={(value) => setEndDate(value)} value={endDate} />
                    </LocalizationProvider>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Тип упаковки</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterValues.packing}
                            name='packing'
                            label="Тип упаковки"
                            onChange={handleChange}
                        >
                            {packingTypes.map((e) => {
                                return <MenuItem value={e}>{e}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Тип доставки</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterValues.delivery}
                            name='delivery'
                            label="Тип доставки"
                            onChange={handleChange}
                        >
                            {deliveryTypes.map((e) => {
                                return <MenuItem value={e}>{e}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <DeliveryDashboard deliveryData={deliveryData}/>

            <Divider sx={{ my: 3 }} />

            {/* Таблица доставок */}
            <TableContainer component={Paper} elevation={4}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Итого</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Дата доставки</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Модель ТС</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Груз</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Услуга</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Дистанция [км]</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.map((delivery) => (
                            <TableRow key={delivery.id}>
                                <TableCell> Доставка {delivery.id}</TableCell>
                                <TableCell>{delivery.orderDate}</TableCell>
                                <TableCell>{delivery.status}</TableCell>
                                <TableCell>{delivery.transport}</TableCell>
                                <TableCell>{delivery.packagingType}</TableCell>
                                <TableCell>{delivery.service}</TableCell>
                                <TableCell>{delivery.distance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};