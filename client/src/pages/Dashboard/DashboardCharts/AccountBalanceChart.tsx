import { LineChart } from '@mui/x-charts';
import { CircularProgress, Box, Fade, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAccountBalanceCurve } from '@/hooks/useAccountBalanceCurve';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo, useState } from 'react';
import Column from '@/components/layout/Containers/Column';

dayjs.extend(utc);

const AccountBalanceChart = ({ accountId }: { accountId: string }) => {
  const [range, setRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

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

  const { data, isLoading } = useAccountBalanceCurve(
    accountId,
    from.toISOString(),
    to.toISOString()
  );

  const xAxisFormatter = (value: Date) => {
    if (range === '1M') {
      return dayjs(value).format('DD MMM');
    }

    if (range === '3M') {
      return dayjs(value).format('DD MMM');
    }

    return dayjs(value).format('MMM YYYY');
  };

  const hasData = !!data?.length;

  return (
    <Column>
      <ToggleButtonGroup
        value={range}
        exclusive
        onChange={(_, newRange) => {
          if (newRange !== null) {
            setRange(newRange);
          }
        }}
        size="small"
        sx={{ alignSelf: 'center' }}
      >
        <ToggleButton value="1M">1M</ToggleButton>
        <ToggleButton value="3M">3M</ToggleButton>
        <ToggleButton value="6M">6M</ToggleButton>
        <ToggleButton value="1Y">1Y</ToggleButton>
      </ToggleButtonGroup>{' '}
      <LineChart
        height={460}
        hideLegend
        grid={{ horizontal: true }}
        series={
          hasData
            ? [
                {
                  data: isLoading ? data.map(() => null) : data.map(d => d.balance),
                  label: 'Balance ₪',
                  color: '#4caf50',
                  showMark: false,
                },
              ]
            : []
        }
        xAxis={[
          {
            data: hasData ? data.map(d => new Date(d.date)) : [],
            scaleType: 'time',
            valueFormatter: xAxisFormatter,
          },
        ]}
      />
      {isLoading && (
        <Fade in={isLoading}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(2px)',
              bgcolor: 'rgba(0,0,0,0.1)',
              borderRadius: 2,
            }}
          >
            <CircularProgress size={36} thickness={4} />
          </Box>
        </Fade>
      )}
    </Column>
  );
};

export default AccountBalanceChart;
