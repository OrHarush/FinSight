import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TableCell, TableRow, Typography } from '@mui/material';
import { BalanceBreakdownEntry } from '@lyra/shared';

import { formatBreakdownDate } from './formatBreakdownDate';
import { formatBreakdownMoney, formatSignedBreakdownMoney } from './formatBreakdownMoney';
import { translatePaymentMethod, translateTxType } from './translateBreakdown';

interface BalanceBreakdownRowProps {
  entry: BalanceBreakdownEntry;
}

const BalanceBreakdownRow = ({ entry }: BalanceBreakdownRowProps) => {
  const muted = !entry.included;
  const cellSx = muted ? { color: 'text.disabled' } : undefined;
  const paymentMethodLabel = translatePaymentMethod(entry.paymentMethodType);

  const contributionColor = muted
    ? 'text.disabled'
    : entry.contributesToSum > 0
      ? 'success.main'
      : entry.contributesToSum < 0
        ? 'error.main'
        : 'text.primary';

  return (
    <TableRow
      hover
      title={entry.reason}
      sx={{
        opacity: muted ? 0.55 : 1,
        bgcolor: muted ? 'action.hover' : 'transparent',
      }}
    >
      <TableCell sx={cellSx}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {entry.name || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {translateTxType(entry.type)}
        </Typography>
      </TableCell>
      <TableCell sx={cellSx}>{formatBreakdownDate(entry.date)}</TableCell>
      <TableCell sx={cellSx} align="left">
        {formatBreakdownMoney(entry.amount)}
      </TableCell>
      <TableCell sx={cellSx}>{paymentMethodLabel}</TableCell>
      <TableCell sx={cellSx}>{formatBreakdownDate(entry.effectiveBalanceDate)}</TableCell>
      <TableCell align="center">
        {entry.included ? (
          <CheckCircleIcon fontSize="small" color="success" />
        ) : (
          <CancelIcon fontSize="small" sx={{ color: 'text.disabled' }} />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          color: contributionColor,
        }}
      >
        {formatSignedBreakdownMoney(entry.contributesToSum)}
      </TableCell>
    </TableRow>
  );
};

export default BalanceBreakdownRow;
