import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Row from '@/components/layout/Containers/Row';

const MonthSelector = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePrevMonth = () => {
    setSelectedMonth(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => prev.add(1, 'month'));
  };

  const formattedMonth = selectedMonth.format('MMMM YYYY');

  if (isMobile) {
    return (
      <Row width={'220px'} alignItems="center" justifyContent={'space-between'} spacing={1}>
        <IconButton onClick={handlePrevMonth} size="small" color={'primary'}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="body1" fontWeight={600}>
          {formattedMonth}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" color={'primary'}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Row>
    );
  }

  return (
    <DatePicker
      views={['month']}
      value={selectedMonth}
      onChange={newValue => setSelectedMonth(newValue ?? dayjs())}
      slotProps={{
        textField: {
          sx: { width: 180, height: 40 },
          size: 'small',
        },
      }}
    />
  );
};

export default MonthSelector;
