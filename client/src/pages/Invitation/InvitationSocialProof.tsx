import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import InviterAvatar from '@/pages/Invitation/InviterAvatar';
import { getFirstName } from '@/pages/Invitation/utils/nameUtils';

interface InvitationSocialProofProps {
  inviterName: string;
  inviterPicture?: string;
}

const InvitationSocialProof = ({
  inviterName,
  inviterPicture,
}: InvitationSocialProofProps) => {
  const { t } = useTranslation('user');

  return (
    <Row spacing={1} alignItems="center" justifyContent="center">
      <InviterAvatar name={inviterName} picture={inviterPicture} size={24} />
      <Typography variant="caption" color="text.secondary">
        {t('sharedHousehold.landing.socialProof', { inviter: getFirstName(inviterName) })}
      </Typography>
    </Row>
  );
};

export default InvitationSocialProof;
