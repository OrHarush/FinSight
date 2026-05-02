import { Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

interface BalanceBreakdownStatProps {
  label: string;
  value: string;
  color?: string;
}

const BalanceBreakdownStat = ({ label, value, color }: BalanceBreakdownStatProps) => (
  <Column spacing={0.25}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontFamily: 'monospace', fontWeight: 700, color: color ?? 'text.primary' }}
    >
      {value}
    </Typography>
  </Column>
);

export default BalanceBreakdownStat;
