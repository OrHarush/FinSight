import { Link, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface LegalMetaProps extends PropsWithChildren {
  email: string;
}

const LegalMeta = ({ email, children }: LegalMetaProps) => {
  const { t } = useTranslation('common');

  return (
    <Column spacing={2}>
      <Column spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {t('LegalPage.contactTitle')}
        </Typography>
        {children}
        <Row spacing={1}>
          <Typography fontWeight={600}>{t('LegalPage.contactEmailLabel')}:</Typography>
          <Link href={`mailto:${email}`} sx={{ color: 'primary.main' }}>
            {email}
          </Link>
        </Row>
      </Column>
    </Column>
  );
};

export default LegalMeta;
