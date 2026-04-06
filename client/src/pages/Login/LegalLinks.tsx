import { Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LegalModal, { LegalType } from '@/components/legal/LegalModal';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useAuth } from '@/providers/AuthProvider';

interface LegalLinksProps {
  variant?: 'body2' | 'caption';
  spacing?: number;
}

const LegalLinks = ({ variant = 'body2', spacing = 1 }: LegalLinksProps) => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  
  const shouldOpenModal = !!user;

  const [activeModal, setActiveModal] = useState<LegalType | null>(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: LegalType) => {
    if (shouldOpenModal) {
      e.preventDefault();
      setActiveModal(type);
    }
  };

  return (
    <>
      <Row
        spacing={spacing}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}
      >
        <Typography
          component="a"
          href={shouldOpenModal ? undefined : ROUTES.TERMS_OF_SERVICE_URL}
          target={shouldOpenModal ? undefined : '_blank'}
          rel="noopener noreferrer"
          variant={variant}
          onClick={e => handleLinkClick(e, 'termsOfService')}
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
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
          href={shouldOpenModal ? undefined : ROUTES.PRIVACY_POLICY_URL}
          target={shouldOpenModal ? undefined : '_blank'}
          rel="noopener noreferrer"
          variant={variant}
          onClick={e => handleLinkClick(e, 'privacyPolicy')}
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
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

      {activeModal && (
        <LegalModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal}
        />
      )}
    </>
  );
};

export default LegalLinks;
