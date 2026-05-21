import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const CHARGES = [
  { key: 'visa', amount: '₪2,840', date: '2/3' },
  { key: 'rent', amount: '₪3,500', date: '5/3' },
  { key: 'loan', amount: '₪900', date: '10/3' },
] as const;

const LogicalMonthMockup = () => {
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
        {t('landing.how.step03.monthTitle')}
      </Typography>

      {CHARGES.map((charge, index) => {
        const isLast = index === CHARGES.length - 1;

        return (
          <Row
            key={charge.key}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{
              py: 1.25,
              borderBottom: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
            }}
          >
            <Column alignItems="flex-start" spacing={0.2} sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: '1.08rem', fontWeight: 600, color: 'text.primary' }}
                noWrap
              >
                {t(`landing.how.step03.charges.${charge.key}`)}
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                {t('landing.how.step03.chargedOn', { date: charge.date })}
                {' · '}
                <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {t('landing.how.step03.belongsTo')}
                </Box>
              </Typography>
            </Column>

            <Typography
              dir="ltr"
              sx={{ fontSize: '1.12rem', fontWeight: 700, color: 'text.primary' }}
            >
              {charge.amount}
            </Typography>
          </Row>
        );
      })}
    </Column>
  );
};

export default LogicalMonthMockup;
