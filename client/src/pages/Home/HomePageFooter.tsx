import { alpha, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';

const HomePageFooter = () => {
  const { t } = useTranslation(['home', 'common']);
  const theme = useTheme();

  return (
    <Column
      alignItems="center"
      spacing={1.5}
      sx={{
        pb: 5,
        pt: 3,
        position: 'relative',
        zIndex: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
      }}
    >
      <Row spacing={3} flexWrap="wrap" justifyContent="center" sx={{ rowGap: 0.5 }}>
        <Typography
          component="a"
          href={'mailto:hello@finsight-app.com'}
          variant="caption"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 0.2s',
          }}
        >
          {t('footerContact')}
        </Typography>
        <Typography
          component="a"
          href={ROUTES.PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 0.2s',
          }}
        >
          {t('common:legal.privacyPolicy')}
        </Typography>
        <Typography
          component="a"
          href={ROUTES.TERMS_OF_SERVICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 0.2s',
          }}
        >
          {t('common:legal.termsOfService')}
        </Typography>
      </Row>

      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
        © {new Date().getFullYear()} FinSight. All rights reserved.
      </Typography>
    </Column>
  );
};

export default HomePageFooter;
