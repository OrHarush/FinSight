import { Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

export interface BalanceHeadlineProps {
  balance: number;
  label: string;
}

const BalanceHeadline = ({ balance, label }: BalanceHeadlineProps) => (
  <Column alignItems="center" minWidth={'120px'}>
    <Row>
      <CurrencyText value={balance} variant={'h5'} fontWeight={700} isAnimated />
    </Row>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Column>
);

export default BalanceHeadline;
