import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import Row from '@/components/shared/layout/containers/Row';
import { useMonthLabels } from '@/hooks/common/useMonthsLabels';

interface DateSelectorProps {
  value: Dayjs;
  onChange: (newDate: Dayjs) => void;
}

const flipIconForRtl = (theme: Theme) =>
  theme.direction === 'rtl' ? 'scaleX(-1)' : 'none';

const MonthDateSelector = ({ value, onChange }: DateSelectorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const monthLabels = useMonthLabels();

  const handlePrevMonth = () => {
    onChange(value.subtract(1, 'month').startOf('month'));
  };

  const handleNextMonth = () => {
    onChange(value.add(1, 'month').startOf('month'));
  };

  const monthIndex = value.month();
  const year = value.year();
  const formattedMonth = `${monthLabels[monthIndex]} ${year}`;

  if (isMobile) {
    return (
      <Row width="160px" alignItems="center" justifyContent="space-between">
        <IconButton onClick={handlePrevMonth} size="small" color="primary">
          <ArrowBackIosNewIcon fontSize="small" sx={{ transform: flipIconForRtl }} />
        </IconButton>
        <Typography variant="body1" fontWeight={600}>
          {formattedMonth}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" color="primary">
          <ArrowForwardIosIcon fontSize="small" sx={{ transform: flipIconForRtl }} />
        </IconButton>
      </Row>
    );
  }

  return (
    <DatePicker
      views={['month', 'year']}
      value={value}
      onChange={newValue => onChange((newValue ?? dayjs()).startOf('month'))}
      format="MMMM YYYY"
      slotProps={{
        textField: {
          sx: { width: 160, height: 40 },
          size: 'small',
        },
      }}
    />
  );
};

export default MonthDateSelector;
