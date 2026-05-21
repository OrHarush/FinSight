import { Typography, alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const PILL_KEYS = ['pillCoffee', 'pillFood', 'pillFuel', 'pillGrocery'] as const;
const PILL_EMOJIS: Record<(typeof PILL_KEYS)[number], string> = {
  pillCoffee: '☕',
  pillFood: '🍔',
  pillFuel: '⛽',
  pillGrocery: '🛒',
};
const SELECTED_PILL: (typeof PILL_KEYS)[number] = 'pillCoffee';

const QuickAddMockup = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Column spacing={1.5} sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary', fontWeight: 600 }}>
        {t('landing.how.step02.quickAddLabel')}
      </Typography>

      <Row spacing={0.6} sx={{ flexWrap: 'nowrap', width: '100%' }}>
        {PILL_KEYS.map(key => {
          const isSelected = key === SELECTED_PILL;

          return (
            <Row
              key={key}
              alignItems="center"
              justifyContent="center"
              spacing={0.35}
              sx={{
                flex: 1,
                minWidth: 0,
                px: 0.75,
                py: 0.6,
                borderRadius: 999,
                backgroundColor: isSelected
                  ? theme.palette.primary.main
                  : alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
                color: isSelected ? '#fff' : '#c4b5fd',
              }}
            >
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'inherit' }} noWrap>
                {t(`landing.how.step02.${key}`)}
              </Typography>
              <Typography aria-hidden="true" sx={{ fontSize: '0.8rem', lineHeight: 1 }}>{PILL_EMOJIS[key]}</Typography>
            </Row>
          );
        })}
      </Row>

      <Column
        spacing={0.85}
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark'
              ? '#0f1521'
              : alpha(theme.palette.text.primary, 0.05),
          borderRadius: 2,
          p: 1.25,
        }}
      >
        <Row justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            {t('landing.how.step02.amountLabel')}
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: 'text.primary', fontWeight: 700 }}>
            ₪14
          </Typography>
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            {t('landing.how.step02.categoryLabel')}
          </Typography>
          <Row alignItems="center" spacing={0.4}>
            <Typography sx={{ fontSize: '0.92rem', color: 'text.primary', fontWeight: 600 }}>
              {t('landing.how.step02.categoryValue')}
            </Typography>
            <Typography aria-hidden="true" sx={{ fontSize: '0.92rem', lineHeight: 1 }}>☕</Typography>
          </Row>
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            {t('landing.how.step02.dateLabel')}
          </Typography>
          <Typography sx={{ fontSize: '0.92rem', color: 'text.primary', fontWeight: 600 }}>
            {t('landing.how.step02.dateValue')}
          </Typography>
        </Row>
      </Column>

      <Row
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: 1.5,
          py: 0.95,
        }}
      >
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'inherit' }}>
          {t('landing.how.step02.addButton')}
        </Typography>
      </Row>
    </Column>
  );
};

export default QuickAddMockup;
