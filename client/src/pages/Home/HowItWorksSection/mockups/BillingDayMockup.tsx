import { Grid, Typography, alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const DISPLAY_DAYS = [10, 15, 20, 2];
const ACTIVE_DAY = 15;

const BillingDayMockup = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Column spacing={1.75} sx={{ width: '100%' }}>
      <Column spacing={0.5} alignItems="center" sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.4,
          }}
        >
          {t('landing.how.step01.question')}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
          {t('landing.how.step01.subtitle')}
        </Typography>
      </Column>

      <Grid container spacing={1}>
        {DISPLAY_DAYS.map(day => {
          const isActive = day === ACTIVE_DAY;

          return (
            <Grid key={day} size={6}>
              <Column
                alignItems="center"
                justifyContent="center"
                sx={{
                  py: 1,
                  height: 54,
                  borderRadius: 1.5,
                  border: `1px solid ${isActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.4)}`,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.action.hover, 0.6),
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                }}
              >
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}>
                  {day}
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: 'inherit', mt: 0.25 }}>
                  {t('landing.how.step01.ofTheMonth')}
                </Typography>
              </Column>
            </Grid>
          );
        })}
      </Grid>
    </Column>
  );
};

export default BillingDayMockup;
