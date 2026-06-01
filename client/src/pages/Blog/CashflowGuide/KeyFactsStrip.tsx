import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';

const FACT_KEYS = ['budget', 'cashflow', 'mistake'] as const;

const KeyFactsStrip = () => {
  const { t } = useTranslation('cashflowGuide');
  const theme = useTheme();

  return (
    <ResponsiveRow spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
      {FACT_KEYS.map(key => (
        <Column
          key={key}
          spacing={0.5}
          alignItems="center"
          justifyContent="center"
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '16px',
            px: 2,
            py: 2.25,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}>
            {t(`keyFacts.${key}.label`)}
          </Typography>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'text.primary' }}>
            {t(`keyFacts.${key}.value`)}
          </Typography>
        </Column>
      ))}
    </ResponsiveRow>
  );
};

export default KeyFactsStrip;
