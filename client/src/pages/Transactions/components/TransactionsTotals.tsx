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
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  return (
    <Row
      spacing={isXs ? 2 : 4}
      alignItems="center"
      justifyContent={isXs ? 'center' : 'flex-start'}
      sx={{ width: '100%' }}
    >
      <Row spacing={1} alignItems="center">
        <ArrowDownwardIcon fontSize="small" color="error" />
        {!isXs && <Typography color="text.secondary">{t('totals.expenses')}:</Typography>}
        <CurrencyText value={totalExpenses} color="error" />
      </Row>
      <Row spacing={1} alignItems="center">
        <ArrowUpwardIcon fontSize="small" color="success" />
        {!isXs && <Typography color="text.secondary">{t('totals.income')}:</Typography>}
        <CurrencyText value={totalIncome} color="success" />
      </Row>
    </Row>
  );
};

export default TransactionsTotals;
