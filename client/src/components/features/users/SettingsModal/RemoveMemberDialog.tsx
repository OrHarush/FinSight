import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Row from '@/components/shared/layout/containers/Row';
import { useRemoveMember } from '@/components/features/users/SettingsModal/hooks/useRemoveMember';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface RemoveMemberDialogProps extends BaseDialogProps {
  workspaceId: string;
  memberUserId: string;
  memberName: string;
}

const RemoveMemberDialog = ({
  isOpen,
  closeDialog,
  workspaceId,
  memberUserId,
  memberName,
}: RemoveMemberDialogProps) => {
  const { t } = useTranslation('user');
  const { alertSuccess, alertError } = useSnackbar();

  const remove = useRemoveMember({
    workspaceId,
    userId: memberUserId,
    onSuccess: () => {
      alertSuccess(t('sharedHousehold.remove.success'));
      closeDialog();
    },
    onError: () => alertError(t('sharedHousehold.remove.error')),
  });

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('sharedHousehold.remove.confirmTitle', { name: memberName })}
      maxWidth="xs"
      forceDialog
    >
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {t('sharedHousehold.remove.confirmBody')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={closeDialog} disabled={remove.isPending}>
            {t('sharedHousehold.remove.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => remove.mutate()}
            disabled={remove.isPending}
          >
            {t('sharedHousehold.remove.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </LyraDialog>
  );
};

export default RemoveMemberDialog;
