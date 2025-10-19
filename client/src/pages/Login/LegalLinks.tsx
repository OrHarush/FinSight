import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/Routes';
import Row from '@/components/layout/Containers/Row';

interface LegalLinksProps {
  variant?: 'body2' | 'caption';
  spacing?: number;
}

const LegalLinks = ({ variant = 'body2', spacing = 1 }: LegalLinksProps) => {
  const { t } = useTranslation('common');

  return (
    <Row
      spacing={spacing}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        component="a"
        href={ROUTES.TERMS_OF_SERVICE_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
          fontSize: variant === 'body2' ? '0.875rem' : '0.75rem',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'text.secondary',
            textDecoration: 'underline',
          },
        }}
      >
        {t('legal.termsOfService')}
      </Typography>
      <Typography variant={variant} sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
        •
      </Typography>
      <Typography
        component="a"
        href={ROUTES.PRIVACY_POLICY_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
          fontSize: variant === 'body2' ? '0.875rem' : '0.75rem',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'text.secondary',
            textDecoration: 'underline',
          },
        }}
      >
        {t('legal.privacyPolicy')}
      </Typography>
    </Row>
  );
};

export default LegalLinks;
