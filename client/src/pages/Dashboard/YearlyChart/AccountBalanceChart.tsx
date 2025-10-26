import { LineChart } from '@mui/x-charts';
import { Skeleton, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useAccountBalanceCurve } from '@/hooks/useAccountBalanceCurve';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo, useState } from 'react';

dayjs.extend(utc);

interface Props {
  accountId: string;
}

const AccountBalanceChart = ({ accountId }: Props) => {
  const [range, setRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

  // Compute date range based on selected value
  const { from, to } = useMemo(() => {
    const now = dayjs.utc();
    switch (range) {
      case '3M':
        return { from: now.subtract(3, 'month').startOf('month'), to: now.endOf('month') };
      case '6M':
        return { from: now.subtract(6, 'month').startOf('month'), to: now.endOf('month') };
      case '1Y':
        return { from: now.subtract(12, 'month').startOf('month'), to: now.endOf('month') };
      default:
        return { from: now.startOf('month'), to: now.endOf('month') };
    }
  }, [range]);

  const { data, isLoading, error, refetch } = useAccountBalanceCurve(
    accountId,
    from.toISOString(),
    to.toISOString()
  );

  if (isLoading) {
    return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />;
  }

  if (error) {
    return <EntityError entityName="transactions" refetch={refetch} />;
  }

  if (!data || data.length === 0) {
    return <EntityEmpty entityName="transactions" icon={TrendingUpIcon} />;
  }

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="range-select-label">Range</InputLabel>
        <Select
          labelId="range-select-label"
          value={range}
          label="Range"
          onChange={e => setRange(e.target.value as '1M' | '3M' | '6M' | '1Y')}
        >
          <MenuItem value="1M">1 Month</MenuItem>
          <MenuItem value="3M">3 Months</MenuItem>
          <MenuItem value="6M">6 Months</MenuItem>
          <MenuItem value="1Y">1 Year</MenuItem>
        </Select>
      </FormControl>
      <LineChart
        height={300}
        hideLegend
        series={[
          {
            data: data.map(d => d.balance),
            label: 'Balance ₪',
            color: '#4caf50',
            showMark: false,
          },
        ]}
        xAxis={[
          {
            data: data.map(d => new Date(d.date)), // actual Date objects, not formatted strings
            scaleType: 'time', // continuous time axis
            valueFormatter: value => dayjs(value).format('MMM YYYY'),
          },
        ]}
      />
    </Box>
  );
};

export default AccountBalanceChart;
