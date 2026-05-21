import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const FIXED_ITEMS = [
  { key: 'salary', amount: '₪8,500', isIncome: true },
  { key: 'rent', amount: '₪3,500' },
  { key: 'gym', amount: '₪149' },
  { key: 'netflix', amount: '₪55' },
] as const;

const FixedExpensesMockup = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Column spacing={0} sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'text.secondary',
          textAlign: 'start',
          mb: 1,
        }}
      >
        {t('landing.how.step01.fixedTitle')}
      </Typography>

      {FIXED_ITEMS.map((item, index) => {
        const isLast = index === FIXED_ITEMS.length - 1;

        return (
          <Row
            key={item.key}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{
              py: 0.85,
              borderBottom: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
            }}
          >
            <Column alignItems="flex-start" spacing={0.15} sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: '1.08rem', fontWeight: 600, color: 'text.primary' }}
                noWrap
              >
                {t(`landing.how.step01.items.${item.key}.name`)}
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                {t(`landing.how.step01.items.${item.key}.billing`)}
              </Typography>
            </Column>

            <Typography
              dir="ltr"
              sx={{
                fontSize: '1.12rem',
                fontWeight: 700,
                color: item.isIncome ? theme.palette.success.main : theme.palette.error.main,
              }}
            >
              {item.amount}
            </Typography>
          </Row>
        );
      })}
    </Column>
  );
};

export default FixedExpensesMockup;
