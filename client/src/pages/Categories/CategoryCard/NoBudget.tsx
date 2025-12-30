import Column from '@/components/shared/layout/containers/Column';
import { Box, Typography } from '@mui/material';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { useTranslation } from 'react-i18next';

interface NoBudgetProps {
  totalCategorySpending: number;
}

const NoBudget = ({ totalCategorySpending }: NoBudgetProps) => {
  const { t } = useTranslation('categories');

  return (
    <Column textAlign={'center'} marginTop={1} spacing={1}>
      <Box
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: 'rgba(255,255,255,0.1)',
          mt: 0.5,
          opacity: 0.5,
        }}
      />

      <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
        <CurrencyText
          value={totalCategorySpending}
          sx={{
            color: totalCategorySpending < 0 ? 'error.main' : 'success.primary',
            fontWeight: 600,
          }}
        />{' '}
        {t('budget.spent')}
      </Typography>
    </Column>
  );
};

export default NoBudget;
