import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Row from '@/components/layout/Containers/Row';
import { useMonthLabels } from '@/hooks/useMonthsLabels';

interface DateSelectorProps {
  value: Dayjs;
  onChange: (newDate: Dayjs) => void;
  allowYearSelection?: boolean;
}

const DateSelector = ({ value, onChange, allowYearSelection = false }: DateSelectorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const monthLabels = useMonthLabels();

  const handlePrevMonth = () => {
    onChange(value.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    onChange(value.add(1, 'month'));
  };

  const monthIndex = value.month();
  const year = value.year();
  const formattedMonth = `${monthLabels[monthIndex]} ${year}`;

  if (isMobile) {
    return (
      <Row width="220px" alignItems="center" justifyContent="space-between" spacing={1} dir={'ltr'}>
        <IconButton onClick={handlePrevMonth} size="small" color="primary">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="body1" fontWeight={600}>
          {formattedMonth}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" color="primary">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Row>
    );
  }

  return (
    <DatePicker
      views={allowYearSelection ? ['year', 'month'] : ['month']}
      value={value}
      onChange={newValue => onChange(newValue ?? dayjs())}
      slotProps={{
        textField: {
          sx: { width: 180, height: 40 },
          size: 'small',
        },
      }}
    />
  );
};

export default DateSelector;
