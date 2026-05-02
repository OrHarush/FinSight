import { Box, Typography } from '@mui/material';
import { BalanceBreakdownResult } from '@lyra/shared';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

import BalanceBreakdownStat from './BalanceBreakdownStat';
import { formatBreakdownDate } from './formatBreakdownDate';
import { formatBreakdownMoney, formatSignedBreakdownMoney } from './formatBreakdownMoney';

interface BalanceBreakdownTotalsProps {
  result: BalanceBreakdownResult;
}

const BalanceBreakdownTotals = ({ result }: BalanceBreakdownTotalsProps) => {
  const totalColor =
    result.totalIncluded > 0
      ? 'success.main'
      : result.totalIncluded < 0
        ? 'error.main'
        : 'text.primary';

  return (
    <Box
      sx={{
        borderRadius: 1.5,
        bgcolor: 'action.hover',
        p: 2,
      }}
    >
      <Column spacing={1.25}>
        <Row spacing={1} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            חשבון:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {result.accountName}
          </Typography>
        </Row>

        <Row spacing={3} flexWrap="wrap">
          <BalanceBreakdownStat
            label="יתרת checkpoint"
            value={formatBreakdownMoney(result.checkpointBalance)}
          />
          <BalanceBreakdownStat
            label="תאריך checkpoint"
            value={formatBreakdownDate(result.checkpointDate)}
          />
          <BalanceBreakdownStat label="עכשיו" value={formatBreakdownDate(result.now)} />
        </Row>

        <Row spacing={3} flexWrap="wrap">
          <BalanceBreakdownStat
            label="סה״כ נכלל"
            value={formatSignedBreakdownMoney(result.totalIncluded)}
            color={totalColor}
          />
          <BalanceBreakdownStat
            label="דולגו (לפני checkpoint)"
            value={String(result.totalSkippedPreCheckpoint)}
          />
          <BalanceBreakdownStat
            label="דולגו (עתידיות)"
            value={String(result.totalSkippedFuture)}
          />
        </Row>

        <Row spacing={1} alignItems="baseline">
          <Typography variant="body2" color="text.secondary">
            יתרה סופית:
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: 'monospace', fontWeight: 700 }}
          >
            {formatBreakdownMoney(result.finalBalance)}
          </Typography>
        </Row>
      </Column>
    </Box>
  );
};

export default BalanceBreakdownTotals;
