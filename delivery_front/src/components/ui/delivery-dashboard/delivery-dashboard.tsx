import { Box, Typography } from '@mui/material';
import type { FC } from 'react';
import type { DeliveryDashboardUIProps } from './type';
import { LineChart } from '@mui/x-charts';


export const DeliveryDashboardUI: FC<DeliveryDashboardUIProps> = ({deliveryData}) => {

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h5" gutterBottom>
        Количество доставок
      </Typography>

      {/* График доставок */}
      <Box sx={{ mb: 4, height: 300 }}>
        <LineChart
          series={[{ data: deliveryData.map(item => item.deliveries_count) , area:true}]}
          xAxis={[{ 
            data: deliveryData.map(item => item.date), 
            scaleType: 'band',
          }]}
          grid={{horizontal:true}}
        />
      </Box>
    </Box>
  );
};