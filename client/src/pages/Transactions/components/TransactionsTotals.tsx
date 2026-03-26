import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

interface TransactionsTotalsProps {
  totalIncome: number;
  totalExpenses: number;
}

const TransactionsTotals = ({ totalIncome, totalExpenses }: TransactionsTotalsProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Row
      spacing={isMobile ? 2 : 4}
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'flex-start'}
    >
      <Row spacing={1} alignItems="center">
        <ArrowDownwardIcon fontSize="small" color="error" />
        {!isMobile && <Typography color="text.secondary">{t('totals.expenses')}:</Typography>}
        <CurrencyText value={totalExpenses} color="error" />
      </Row>
      <Row spacing={1} alignItems="center">
        <ArrowUpwardIcon fontSize="small" color="success" />
        {!isMobile && <Typography color="text.secondary">{t('totals.income')}:</Typography>}
        <CurrencyText value={totalIncome} color="success" />
      </Row>
    </Row>
  );
};

export default TransactionsTotals;
