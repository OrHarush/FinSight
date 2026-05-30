import { Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { maskEmail } from '@/pages/Invitation/utils/maskEmail';

interface InvitationFooterStripProps {
  invitedEmail: string;
}

const InvitationFooterStrip = ({ invitedEmail }: InvitationFooterStripProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();

  return (
    <Row
      justifyContent="center"
      sx={{
        width: '100%',
        mt: 1,
        px: 2,
        py: 1.25,
        borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        backgroundColor: alpha(theme.palette.text.primary, 0.03),
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        {t('sharedHousehold.landing.footer', { email: maskEmail(invitedEmail) })}
      </Typography>
    </Row>
  );
};

export default InvitationFooterStrip;
