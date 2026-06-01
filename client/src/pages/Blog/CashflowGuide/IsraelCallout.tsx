import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const BRAND_PURPLE = '#a78bfa';

const IsraelCallout = () => {
  const { t } = useTranslation('cashflowGuide');
  const theme = useTheme();

  return (
    <Column
      component="section"
      spacing={1.5}
      sx={{
        borderLeft: `3px solid ${BRAND_PURPLE}`,
        backgroundColor: alpha(BRAND_PURPLE, theme.palette.mode === 'dark' ? 0.07 : 0.04),
        borderRadius: '0 12px 12px 0',
        px: 2.5,
        py: 2,
      }}
    >
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {t('sections.israelProblem.heading')}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        {t('sections.israelProblem.para1')}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        {t('sections.israelProblem.para2')}
      </Typography>
      <Box
        sx={{
          borderLeft: `2px solid ${alpha(BRAND_PURPLE, 0.5)}`,
          pl: 1.5,
          py: 0.5,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem', lineHeight: 1.6 }}
        >
          {t('sections.israelProblem.emphasis')}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        {t('sections.israelProblem.para3')}
      </Typography>
    </Column>
  );
};

export default IsraelCallout;
