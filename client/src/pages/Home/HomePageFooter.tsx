import { Typography } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useTranslation } from 'react-i18next';

const HomePageFooter = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <Column alignItems="center" sx={{ pb: 4, position: 'relative', zIndex: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {t('footer')}
      </Typography>
      <Row spacing={2}>
        <Typography
          component="a"
          href={ROUTES.PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
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
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('common:legal.termsOfService')}
        </Typography>
      </Row>
    </Column>
  );
};

export default HomePageFooter;
