import { Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useTranslation } from 'react-i18next';

const HomePageFooter = () => {
  const { t } = useTranslation('home');

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
          Privacy Policy
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
          Terms of Service
        </Typography>
      </Row>
    </Column>
  );
};

export default HomePageFooter;
