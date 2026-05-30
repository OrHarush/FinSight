import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { PendingInvitationView } from '@/types/Workspace';

interface PendingInvitationRowProps {
  workspaceId: string;
  invitation: PendingInvitationView;
}

const PendingInvitationRow = ({ workspaceId, invitation }: PendingInvitationRowProps) => {
  const { t } = useTranslation('user');
  const { alertSuccess, alertError } = useSnackbar();

  const revoke = useApiMutation<void, void>({
    method: 'delete',
    url: API_ROUTES.WORKSPACE_INVITATION_BY_ID(workspaceId, invitation._id),
    queryKeysToInvalidate: [queryKeys.workspaces()],
    options: {
      onSuccess: () => {
        alertSuccess(t('sharedHousehold.pending.revokeSuccess'));
      },
      onError: () => {
        alertError(t('sharedHousehold.pending.revokeError'));
      },
    },
  });

  const formattedDate = dayjs(invitation.expiresAt).format('DD/MM/YYYY');

  return (
    <Row
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        bgcolor: 'action.hover',
        gap: 1,
      }}
    >
      <Column sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {invitation.invitedEmail}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('sharedHousehold.pending.expiresAt', { date: formattedDate })}
        </Typography>
      </Column>
      <Tooltip title={t('sharedHousehold.pending.revoke')}>
        <IconButton
          size="small"
          color="error"
          onClick={() => revoke.mutate()}
          disabled={revoke.isPending}
          aria-label={t('sharedHousehold.pending.revoke')}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Row>
  );
};

export default PendingInvitationRow;
