import { Typography } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';

export interface BalanceHeadlineProps {
  balance: number;
  label: string;
}

const BalanceHeadline = ({ balance, label }: BalanceHeadlineProps) => (
  <Column>
    <Typography variant="h4" fontWeight={700}>
      {`₪${balance.toLocaleString()}`}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Column>
);

export default BalanceHeadline;
